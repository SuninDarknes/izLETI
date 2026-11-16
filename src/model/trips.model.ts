import { Pool, PoolClient } from "pg"
import pool from "../connect"
import { NotFoundError } from "../errors"
import { activities, Activity } from "./activities.model"

export type EditTrip = {
    id : number,
    name : string,
    description : string,
    durationMinutes : number,
    meetingPointLatitude : number,
    meetingPointLongitude : number,
    maxParticipants : number,
    basePrice : number
}

export type NewTrip = Omit<EditTrip, "id">

export type Trip = EditTrip & {
    createdAt : Date,
    activities : Activity[],
    tags : Tag[]
}

type TripRow = {
    id : number,
    name : string,
    description : string,
    durationminutes : number,
    meetingpointlatitude : string,
    meetingpointlongitude : string,
    maxparticipants : number,
    baseprice : string,
    createdat : Date,
    active : boolean
}


export type Tag = {
    id : number,
    name : string
}

export type NewTag = {
    name : string
}

function rowToTrip(row : TripRow, activities : Activity[], tags : Tag[]) : Trip {
    return {
        id : row.id,
        name : row.name,
        description : row.description,
        durationMinutes : row.durationminutes,
        meetingPointLatitude : +row.meetingpointlatitude,
        meetingPointLongitude : +row.meetingpointlongitude,
        maxParticipants : row.maxparticipants,
        basePrice : +row.baseprice,
        createdAt : row.createdat,
        activities : activities,
        tags : tags
    };
}


class Trips {

    // ======================================================================================================================
    // ====================================================TRIPS=============================================================
    // ======================================================================================================================

    /**
     * Checks whether a trip with the id exists.
     */
    async exists(id : number, client : Pool | PoolClient = pool) : Promise<boolean> {
        let response = await client.query<{id: number}>(`
            SELECT id
            FROM trips
            WHERE id = $1;
        `, [id]);

        return response.rowCount != 0;
    }

    /**
     * Creates a new trip and assigns the specified activities and tags to it.
     * The activity IDs are assigned sequence orders based on their position in the provided array.
     * All database operations are executed within a single transaction.
     * @param trip - Data of the trip to create.
     * @param activityIds - Array of IDs of activities to assign to the trip.
     * @param tagIds - Array of IDs of tags to assign to the trip.
     * @returns ID of the newly created trip.
     * @throws {Error} If the trip or any of its relationships cannot be created.
     */
    async createTrip(trip : NewTrip, activityIds : number[], tagIds : number[]) : Promise<number> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            let response = await client.query<{id : number}>(`
                INSERT INTO trips (name, description, durationminutes, meetingPointLatitude, meetingPointLongitude, maxParticipants, basePrice, createdAt, active)
                VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, true)
                RETURNING id;
            `,
            [
                trip.name,
                trip.description,
                trip.durationMinutes,
                trip.meetingPointLatitude,
                trip.meetingPointLongitude,
                trip.maxParticipants,
                trip.basePrice
            ]);

            let tripId = response.rows[0].id;

            for (const [index, activityId] of activityIds.entries()) {
                await client.query(`
                    INSERT INTO TripActivity (sequenceOrder, tripId, activityId)
                    VALUES ($1, $2, $3)
                `,
                [
                    index,
                    tripId,
                    activityId
                ]);
            }

            for (let tagId of tagIds) {
                await client.query(`
                    INSERT INTO TripTag (tripId, tagId)
                    VALUES ($1, $2)
                `,
                [
                    tripId,
                    tagId
                ]);
            }

            await client.query('COMMIT');

            return tripId;
        }
        catch (err) {
            await client.query('ROLLBACK');
            throw err;
        }
        finally {
            client.release();
        }
    }

    /**
     * Gets a trip by ID, including its assigned activities and tags.
     * Inactive trips are not returned.
     * Activities and tags are retrieved concurrently.
     * @param id - ID of the trip to retrieve.
     * @returns The requested trip with its activities and tags.
     * @throws {NotFoundError} If no active trip with the specified ID exists.
     */
    async getTrip(id: number): Promise<Trip> {
        const tripResponse = await pool.query<TripRow>(`
            SELECT *
            FROM Trips
            WHERE id = $1
            AND active = true;
        `, [id]);

        if (tripResponse.rowCount === 0) {
            throw new NotFoundError('Trip', id);
        }

        // Retrieve activities and tags concurrently.
        let [tripActivities, tripTags] = await Promise.all([
            activities.getTripActivities(id),
            this.getTripTags(id)
        ]);

        // Convert the database row and attach its related data.
        return rowToTrip(tripResponse.rows[0], tripActivities, tripTags);
    }

    /**
     * Updates an existing trip by ID.
     * Only active trips can be updated.
     * @throws {NotFoundError} If no active trip with the specified ID exists.
     */
    async editTrip(trip : EditTrip) : Promise<void> {
        let response = await pool.query(`
            UPDATE trips
            SET
                name = $2,
                description = $3,
                durationMinutes = $4,
                meetingPointLatitude = $5,
                meetingPointLongitude = $6,
                maxParticipants = $7,
                basePrice = $8
            WHERE id = $1
            AND active = true;
        `,
        [
            trip.id,
            trip.name,
            trip.description,
            trip.durationMinutes,
            trip.meetingPointLatitude,
            trip.meetingPointLongitude,
            trip.maxParticipants,
            trip.basePrice
        ]);

        if (!response.rowCount) {
            throw new NotFoundError('Trip', trip.id);
        }
    }

    /**
     * 'Deletes' an existing trip by setting its active column to false.
     * @throws {NotFoundError} If no trip with the specified ID exists.
     */
    async removeTrip(id : number) : Promise<void> {
        let response = await pool.query(`
            UPDATE trips
            SET active = false
            WHERE id = $1
        `, [id]);

        if (!response.rowCount) {
            throw new NotFoundError('Trip', id);
        }
    }


    // ======================================================================================================================
    // =====================================================TAGS=============================================================
    // ======================================================================================================================

    /**
     * Creates a new trip tag.
     * New tags are active by default.
     * @returns ID of the newly created tag.
     */
    async createTag(tag : NewTag) : Promise<number> {
        let response = await pool.query<{id : number}>(`
            INSERT INTO tripTags (name, active)
            VALUES ($1, true)
            RETURNING id;
        `,
        [
            tag.name
        ]);

        return response.rows[0].id;
    }

    /**
     * Gets a trip tag by ID.
     * Inactive tags are not returned.
     * @throws {NotFoundError} If no active tag with the specified ID exists.
     */
    async getTag(id : number) : Promise<Tag> {
        let response = await pool.query<Tag>(`
            SELECT id, name
            FROM tripTags tags
            WHERE tags.id = $1
            AND tags.active = true;
        `,
        [id]);

        if (!response.rows[0]) {
            throw new NotFoundError('TripTag', id);
        }

        return response.rows[0];
    }

    /**
     * Updates an existing trip tag by ID.
     * @param tag - Updated tag data, including its ID.
     * @throws {NotFoundError} If no active tag with the specified ID exists.
     */
    async editTag(tag : Tag) : Promise<void> {
        let response = await pool.query(`
            UPDATE tripTags
            SET name = $2
            WHERE id = $1
            AND active = true;
        `,
        [
            tag.id,
            tag.name
        ]);

        if (!response.rowCount) {
            throw new NotFoundError('TripTag', tag.id);
        }
    }

    /**
     * 'Deletes' an existing trip tag by setting its active column to false.
     * @throws {NotFoundError} If no tag with the specified ID exists.
     */
    async deleteTag(id : number) : Promise<void> {
        let response = await pool.query(`
            UPDATE tripTags
            SET active = false
            WHERE id = $1
        `, [id]);

        if (!response.rowCount) {
            throw new NotFoundError('TripTag', id);
        }
    }

    /**
     * Associates an existing tag with a trip.
     * @throws {Error} If the association cannot be created, for example
     * if the trip or tag does not exist or the association already exists.
     */
    async addTag(tripId : number, tagId : number) : Promise<void> {
        await pool.query(`
            INSERT INTO tripTag (tripId, tagId)
            VALUES ($1, $2)
        `, [tripId, tagId]);
    }

    /**
     * Removes the association between a trip and a tag.
     * Does not delete the tag itself.
     * @throws {NotFoundError} If the specified association does not exist.
     */
    async removeTag(tripId : number, tagId : number) {
        let response = await pool.query(`
            DELETE FROM tripTag
            WHERE tripId = $1
            AND tagId = $2
        `, [tripId, tagId]);

        if (!response.rowCount) {
            throw new NotFoundError('Trip or Tag');
        }
    }

    /**
     * Gets all active tags assigned to a trip.
     * Inactive trips and tags are excluded.
     * @returns Array of tags assigned to the trip.
     */
    async getTripTags(tripId : number) : Promise<Tag[]> {
        let response = await pool.query<Tag>(`
            SELECT tags.id, tags.name
            FROM trips t
            JOIN tripTag tt ON tt.tripId = t.id
            JOIN tripTags tags ON tt.tagId = tags.id
            WHERE t.id = $1
            AND t.active = true
            AND tags.active = true;
        `, [tripId]);

        return response.rows;
    }
}

export const trips = new Trips();