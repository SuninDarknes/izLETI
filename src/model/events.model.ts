import pool from '../connect'
import { NotFoundError } from '../errors'
import { Trip, trips } from './trips.model'
import { addons } from './addons.model'
import { Pool, PoolClient } from 'pg'
import { stat } from 'node:fs'

export enum EventState {
    Hidden = "hidden",
    Scheduled = "scheduled",
    Full = "full",
    Cancelled = "cancelled",
    Completed = "completed"
}

export enum EventOrdering {
    byName,
    byPrice,
    byDate,
    byRating
}

export enum SortDirection {
    Ascending = "ASC",
    Descending = "DESC"
}

export type EventSort = {
    ordering : EventOrdering,
    direction : SortDirection
}

type NewEvent = {
    startDateTime : Date,
    capacity : number,
    state : EventState
}

type EditEvent = NewEvent & {
    id : number
};

type Event = EditEvent & {
    trip : Trip,
    availableAddons : EventAddon[]
}

type EventRow = {
    id : number,
    startdatetime : Date,
    capacity : number,
    state : string,
    tripId : number
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

type EventFilter = {
    nameContains? : string,
    dateFrom? : Date,
    dateTo? : Date,
    priceFrom? : number,
    priceTo? : number,
    /*location,*/
    tagIds? : number[],
    /*minFreeSpots,*/
    states? : EventState[]
    /*availableLanguage*/
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
            trips.getTrip(response.rows[0].tripId),
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
        sort : EventSort = {ordering : EventOrdering.byName, direction : SortDirection.Ascending}) {

            if (page <= 0 || pageSize <= 0 || 1000 < pageSize) {
                throw new Error('Invalid paging parameters');
            }

            let params : any[] = [];
            let paramIndex = 1;
            let conditions : string[] = [];

            if (filter.nameContains) {
                params.push(filter.nameContains)
                conditions.push(`t.name LIKE %$${paramIndex++}%`)
            }

            if (filter.dateFrom) {
                params.push(filter.dateFrom)
                conditions.push(`e.startDateTime > $${paramIndex++}`)
            }
            if (filter.dateTo) {
                params.push(filter.dateTo)
                conditions.push(`e.startDateTime < $${paramIndex++}`)
            }

            if (filter.priceFrom !== undefined) {
                params.push(filter.priceFrom)
                conditions.push(`e.price < $${paramIndex++}`)
            }
            if (filter.priceTo !== undefined) {
                params.push(filter.priceTo)
                conditions.push(`e.price > $${paramIndex++}`)
            }

            let response = await pool.query<{id: number}>(`
                SELECT e.id
                FROM events e
                JOIN trips t ON t.id = e.tripId
                JOIN eventStates s ON s.id = e.stateId
                WHERE ${conditions.join(' AND ')}
                ORDER BY ${sort.ordering as string} ${sort.direction as string}, e.id ASC
                LIMIT ${limit}
                OFFSET ${offset};
            `, params);
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