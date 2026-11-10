import pool from '../connect'
import { NotFoundError } from '../errors'
import { Trip, trips } from './trips.model'
import { addons } from './addons.model'
import { Pool, PoolClient } from 'pg'

export enum EventState {
    Hidden = "hidden",
    Scheduled = "scheduled",
    Full = "full",
    Cancelled = "cancelled",
    Completed = "completed"
}

export enum EventOrdering {
    byName = "t.name",
    byPrice = "t.basePrice",
    byDate = "e.startDateTime",
    // byRating = ""
}

export enum SortDirection {
    Ascending = "ASC",
    Descending = "DESC"
}

export type EventSort = {
    ordering : EventOrdering,
    direction : SortDirection
}

export type NewEvent = {
    startDateTime : Date,
    capacity : number,
    state : EventState
}

export type EditEvent = NewEvent & {
    id : number
};

export type Event = EditEvent & {
    trip : Trip,
    availableAddons : EventAddon[]
}

type EventRow = {
    id : number,
    startdatetime : Date,
    capacity : number,
    state : string,
    tripid : number
}


export type NewEventAddon = {
    addonId : number,
    description : string,
    price : number,
    capacity : number
}

export type EventAddon = NewEventAddon & {
    id : number,
    name : string
}

type EventAddonRow = {
    id : number,
    addonid : number,
    name : string,
    description : string,
    price : string,
    capacity : number
}

export type EventFilter = {
    nameContains? : string,
    dateFrom? : Date,
    dateTo? : Date,
    priceFrom? : number,
    priceTo? : number,
    //location,
    tagIds? : number[],
    //minFreeSpots,
    states? : EventState[]
    //availableLanguage
}

function rowToEvent(row : EventRow, trip : Trip, availableAddons : EventAddon[]) : Event {
    return {
        id : row.id,
        startDateTime : row.startdatetime,
        capacity : row.capacity,
        state : row.state as EventState,
        trip : trip,
        availableAddons : availableAddons
    }
}

function rowToEventAddon(row : EventAddonRow) : EventAddon {
    return {
        id : row.id,
        addonId : row.addonid,
        name : row.name,
        description : row.description,
        price : +row.price,
        capacity : row.capacity
    }
}

class Events {

    // ======================================================================================================================
    // ===================================================EVENTS=============================================================
    // ======================================================================================================================

    async exists(id : number, client : Pool | PoolClient = pool) : Promise<boolean> {
        let response = await client.query<{id: number}>(`
            SELECT id
            FROM events
            WHERE id = $1;
        `, [id]);

        return response.rowCount != 0;
    }

    async createEvent(event : NewEvent, tripId : number, addons : NewEventAddon[]) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            if (!(await trips.exists(tripId, client))) {
                throw new NotFoundError("Trip", tripId);
            }

            let response = await client.query<{id : number}>(`
                INSERT INTO events (startDateTime, capacity, tripId, stateId)
                VALUES ($1, $2, $3, (SELECT id FROM eventStates WHERE LOWER(name) = LOWER($4)))
                RETURNING id;
            `,
            [
                event.startDateTime,
                event.capacity,
                tripId,
                event.state
            ]);

            let eventId = response.rows[0].id;

            for (const addon of addons) {
                await this.addEventAddon(eventId, addon, client);
            }

            await client.query('COMMIT');

            return eventId;
        }
        catch (err) {
            await client.query('ROLLBACK');
            throw err;
        }
        finally {
            client.release();
        }
    }

    async getEvent(id : number) : Promise<Event> {
        let response = await pool.query<EventRow>(`
            SELECT e.id, e.startDateTime, e.capacity, s.name AS state, e.tripId
            FROM events e
            JOIN eventStates s ON s.id = e.stateId
            WHERE e.id = $1
        `,
        [
            id
        ]);

        if (!response.rowCount) {
            throw new NotFoundError("Event", id);
        }

        let [trip, availableAddons] = await Promise.all([
            trips.getTrip(response.rows[0].tripid),
            this.getEventAddons(id)
        ]);

        return rowToEvent(response.rows[0], trip, availableAddons);
    }

    async getTripEvents(tripId : number) : Promise<number[]> {
        if (!(await trips.exists(tripId))) {
            throw new NotFoundError("Trip", tripId);
        }

        let response = await pool.query<{id : number}>(`
            SELECT e.id
            FROM events e
            JOIN eventStates s ON s.id = e.stateId
            WHERE e.tripId = $1
        `,
        [
            tripId
        ]);

        return response.rows.map(row => row.id);
    }

    async getFilteredEvents(filter : EventFilter, page : number, pageSize : number,
        sort : EventSort = {ordering : EventOrdering.byName, direction : SortDirection.Ascending}) : Promise<number[]> {

            if (page <= 0 || pageSize <= 0 || 1000 < pageSize) {
                throw new Error('Invalid paging parameters');
            }

            if (!Object.values(EventOrdering).includes(sort.ordering) ||
                !Object.values(SortDirection).includes(sort.direction)) {
                throw new Error('Invalid sort parameters');
            }

            let params : any[] = [];
            let paramIndex = 1;
            let conditions : string[] = [];

            conditions.push("t.active = true");

            if (filter.nameContains) {
                params.push("%" + filter.nameContains + "%");
                conditions.push(`t.name ILIKE $${paramIndex++}`);
            }

            if (filter.dateFrom) {
                params.push(filter.dateFrom);
                conditions.push(`e.startDateTime >= $${paramIndex++}`);
            }
            if (filter.dateTo) {
                params.push(filter.dateTo);
                conditions.push(`e.startDateTime <= $${paramIndex++}`);
            }

            if (filter.priceFrom !== undefined) {
                params.push(filter.priceFrom);
                conditions.push(`t.basePrice >= $${paramIndex++}`);
            }
            if (filter.priceTo !== undefined) {
                params.push(filter.priceTo);
                conditions.push(`t.basePrice <= $${paramIndex++}`);
            }

            if (filter.tagIds && filter.tagIds.length > 0) {
                params.push(filter.tagIds);
                conditions.push(`
                    EXISTS (
                        SELECT 1
                        FROM tripTag tt
                        JOIN tripTags tg ON tg.id = tt.tagId
                        WHERE tt.tripId = t.id
                        AND tg.active = true
                        AND tg.id = ANY($${paramIndex++}::integer[])
                    )    
                `);
            }

            if (filter.states && filter.states.length > 0) {
                params.push(filter.states.map(state => (state as string).toLowerCase()));
                conditions.push(`LOWER(s.name) = ANY($${paramIndex++}::varchar[])`)
            }

            params.push(pageSize); // LIMIT
            params.push((page - 1) * pageSize); // OFFSET

            let response = await pool.query<{id: number}>(`
                SELECT e.id
                FROM events e
                JOIN trips t ON t.id = e.tripId
                JOIN eventStates s ON s.id = e.stateId
                WHERE ${conditions.join(' AND ')}
                ORDER BY ${sort.ordering} ${sort.direction}, e.id ASC
                LIMIT $${paramIndex++}
                OFFSET $${paramIndex++};
            `, params);

            return response.rows.map(row => row.id)
    }

    async editEvent(event : EditEvent) : Promise<void> {
        let response = await pool.query(`
            UPDATE events
            SET
                startDateTime = $2,
                capacity = $3,
                stateId = (SELECT id FROM eventStates where LOWER(name) = LOWER($4))
            WHERE id = $1;
        `,
        [
            event.id,
            event.startDateTime,
            event.capacity,
            event.state as string
        ]);

        if (!response.rowCount) {
            throw new NotFoundError('Event', event.id);
        }
    }

    async setEventState(eventId : number, state : EventState) {
        let response = await pool.query(`
            UPDATE events
            SET
                stateId = (SELECT id FROM eventStates where LOWER(name) = LOWER($2))
            WHERE id = $1;
        `,
        [
            eventId,
            state as string
        ]);

        if (!response.rowCount) {
            throw new NotFoundError('Event', eventId);
        }
    }

    // ======================================================================================================================
    // ================================================EVENT ADDONS==========================================================
    // ======================================================================================================================

    async addEventAddon(eventId : number, addon : NewEventAddon, client : Pool | PoolClient = pool) : Promise<void>{
        if (!(await this.exists(eventId, client))) {
            throw new NotFoundError("Event", eventId);
        }
        if (!(await addons.exists(addon.addonId, client))) {
            throw new NotFoundError("Addon", addon.addonId);
        }

        await client.query(`
            INSERT INTO eventAddons (description, price, capacity, eventId, addonId, active)
            VALUES ($1, $2, $3, $4, $5, true)
        `,
        [
            addon.description,
            addon.price,
            addon.capacity,
            eventId,
            addon.addonId
        ]);
    }

    /**
    * Gets all active addons available for a specific event, sorted alphabetically by addon name.
    * @returns Array of active event addons, or an empty array if the event has no active addons.
    * @throws {NotFoundError} If the event is not found.
    */
    async getEventAddons(eventId : number) : Promise<EventAddon[]> {
        if (!(await this.exists(eventId))) {
            throw new NotFoundError("Event", eventId);
        }

        let response = await pool.query<EventAddonRow>(`
            SELECT
                ea.id,
                ea.addonId,
                a.name,
                ea.description,
                ea.price,
                ea.capacity
            FROM eventAddons ea
            JOIN addons a ON ea.addonId = a.id
            WHERE ea.eventId = $1
            AND ea.active = true
            AND a.active = true
            ORDER BY a.name;
        `, [eventId]);

        return response.rows.map(rowToEventAddon);
    }
}

export const events = new Events();