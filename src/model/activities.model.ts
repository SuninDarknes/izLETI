import pool from '../connect'
import { NotFoundError } from '../errors'

export type NewActivity = {
    name : string,
    description : string,
    locationName : string,
    latitude : number,
    longitude : number,
    durationMinutes : number | null,
    categoryId : number
}

export type EditActivity = NewActivity & {id : number}

export type Activity = NewActivity & {
    id : number,
    categoryName? : string
}

type ActivityRow = {
    id : number,
    name : string,
    description : string,
    locationname : string,
    latitude : string,
    longitude : string,
    durationminutes : number | null,
    categoryid : number,
    active : boolean,
    categoryname? : string
}

export type NewActivityCategory = {
    name : string
}

export type ActivityCategory = NewActivityCategory & {
    id : number
}

type ActivityCategoryRow = ActivityCategory & {
    active : boolean
}


function rowToActivity(row : ActivityRow) : Activity {
    return {
        id : row.id,
        name : row.name,
        description : row.description,
        locationName : row.locationname,
        latitude : +row.latitude,
        longitude : +row.longitude,
        durationMinutes : row.durationminutes,
        categoryId : row.categoryid,
        categoryName : row.categoryname
    }
}

function rowToCategory(row : ActivityCategoryRow) : ActivityCategory {
    return {
        id : row.id,
        name : row.name
    };
}


class Activities {

    // ======================================================================================================================
    // ==================================================ACTIVITIES==========================================================
    // ======================================================================================================================

    /**
    * Creates a new activity in the database.
    * @returns Id of the created activity.
    */
    async createActivity(activity : NewActivity) : Promise<number> {
        let response =  await pool.query<{id : number}>(`
            INSERT INTO activities (name, description, locationname, longitude, latitude, durationminutes, categoryId, active)
            VALUES ($1, $2, $3, $4, $5, $6, $7, true)
            RETURNING id;
        `, 
        [
            activity.name,
            activity.description,
            activity.locationName,
            activity.longitude,
            activity.latitude,
            activity.durationMinutes,
            activity.categoryId
        ]
        );

        return response.rows[0].id;
    }

    /**
    * Gets activity from the database by id
    * @returns The activity
    * @throws {NotFoundError} If the activity is not found.
    */
    async getActivity(id : number) : Promise<Activity> {
        let response = await pool.query<ActivityRow>(`
            SELECT a.*, c.name categoryName
            FROM activities a
            JOIN activityCategories c ON a.categoryId = c.id
            WHERE a.id = $1
            AND a.active = true;
        `,
        [id]);
        
        if (!response.rowCount) {
            throw new NotFoundError('Activity', id);
        }

        return rowToActivity(response.rows[0]);
    }

    /**
    * Updates an existing activity by id.
    * @throws {NotFoundError} If no activity with the specified ID exists.
    */
    async editActivity(activity : EditActivity) : Promise<void> {
        let response = await pool.query(`
            UPDATE activities
            SET
                name = $2,
                description = $3,
                locationname = $4,
                longitude = $5,
                latitude = $6,
                durationminutes = $7,
                categoryId = $8
            WHERE id = $1
            AND active = true;
        `,
        [
            activity.id,
            activity.name,
            activity.description,
            activity.locationName,
            activity.longitude,
            activity.latitude,
            activity.durationMinutes,
            activity.categoryId
        ]
        );

        if (!response.rowCount) {
            throw new NotFoundError('Activity', activity.id);
        }
    }

    /**
     * 'Deletes' an existing activity (by setting the active column to false)
     * @throws {NotFoundError} If no activity with the specified id exists
     */
    async deleteActivity(id : number) : Promise<void> {
        let response = await pool.query(`
            UPDATE activities
            SET active = false
            WHERE id = $1
        `,
        [id]);

        if (!response.rowCount) { 
            throw new NotFoundError('Activity', id);
        }
    }

    /**
    * Returns a page of all activities that satisfy the filters sorted alphabetically
    * @param page - the index of the page (1-indexed)
    * @param pageSize - the number of activities per page
    * @param categoryId - optional category filter
    * @param nameContains - optional search parameter
    * @returns array of activities that satisfy the filter and are on the required page
    * @throws {Error} - if page index is less then 1 or if page size out of bounds [1, 1000]
    */
    async filterActivities(page : number, pageSize : number, categoryId? : number, nameContains? : string) : Promise<Activity[]> {
        if (page <= 0 || pageSize <= 0 || 1000 < pageSize) {
            throw new Error('Invalid paging parameters');
        }
        
        let response = await pool.query<ActivityRow>(`
            SELECT a.*, c.name categoryName
            FROM activities a
            JOIN activityCategories c ON a.categoryId = c.id
            WHERE ($1::integer IS NULL OR c.id = $1)
            AND ($2::text IS NULL OR a.name ILIKE ('%' || $2 || '%'))
            AND a.active = true
            ORDER BY a.name, a.id
            LIMIT $3
            OFFSET $4
        `,
        [
            categoryId ?? null,
            nameContains ?? null,
            pageSize,
            (page - 1) * pageSize
        ]
        );

        return response.rows.map(rowToActivity);
    }

    /**
     * Get all the activites asigned to a trip in sequence order
     */
    async getTripActivities(tripId : number) : Promise<Activity[]> {
        let response = await pool.query<ActivityRow>(
            `SELECT a.*, c.name categoryName
            FROM activities a
            JOIN tripActivity ta ON ta.activityId = a.id
            JOIN activityCategories c ON a.categoryId = c.id
            WHERE ta.tripId = $1
            AND a.active = true
            ORDER BY ta.sequenceOrder`,
            [tripId]
        );

        return response.rows.map(rowToActivity);
    }

    // ======================================================================================================================
    // ==================================================CATEGORIES==========================================================
    // ======================================================================================================================

    /**
    * Creates a new activity category in the database.
    * @returns Id of the created category.
    */
    async createCategory(category : NewActivityCategory) : Promise<number> {
        let response = await pool.query<{id : number}>(`
            INSERT INTO activityCategories (name, active)
            VALUES ($1, true)
            RETURNING id;
        `, 
        [
            category.name
        ]
        );

        return response.rows[0].id;
    }

    /**
    * Gets category from the database by id
    * @returns The category
    * @throws {NotFoundError} If the category is not found.
    */
    async getCategory(id : number) : Promise<ActivityCategory> {
        let response = await pool.query<ActivityCategoryRow>(`
            SELECT *
            FROM activityCategories ac
            WHERE ac.id = $1
            AND ac.active = true;
        `,
        [id]);
        
        if (!response.rows[0]) {
            throw new NotFoundError('ActivityCategory', id);
        }

        return rowToCategory(response.rows[0]);
    }

    /**
    * Updates an existing category by id.
    * @throws {NotFoundError} If no category with the specified ID exists.
    */
    async editCategory(category : ActivityCategory) : Promise<void> {
        let response = await pool.query(`
            UPDATE activityCategories 
            SET name = $2
            WHERE id = $1
            AND active = true;
        `,
        [
            category.id,
            category.name
        ]
        );

        if (!response.rowCount) {
            throw new NotFoundError('ActivityCategory', category.id);
        }
    }

    /**
     * 'Deletes' an existing activity category (by setting the active column to false)
     * @throws {NotFoundError} If no activity category with the specified id exists
     */
    async deleteCategory(id : number) : Promise<void>{
        let response = await pool.query(`
            UPDATE activityCategories
            SET active = false
            WHERE id = $1
        `,
        [id]);

        if (!response.rowCount) { 
            throw new NotFoundError('ActivityCategory', id);
        }
    }

    /**
    * Returns all activity categories sorted alphabetically
    * @returns array of categories
    */
    async getCategories() : Promise<ActivityCategory[]> {
        let response = await pool.query<ActivityCategoryRow>(
            `SELECT *
            FROM activityCategories
            WHERE active = true
            ORDER BY name`
        );

        return response.rows.map(rowToCategory);
    }
}

export const activities = new Activities();