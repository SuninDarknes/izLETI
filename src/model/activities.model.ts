import pool from '../connect'
import { NotFoundError } from '../errors'

export type Activity = {
    id : number,
    name : string,
    description : string,
    locationName : string,
    longitude : number,
    latitude : number,
    durationMinutes : number,
    categoryId : number,
    categoryName? : string
}

export type ActivityCategory = {
    id : number,
    name : string
}

type ActivityRow = {
    id : number,
    name : string,
    description : string,
    locationname : string,
    startlatitude : string,
    startlongitude : string,
    durationminutes : number,
    categoryid : number,
    categoryname? : string
}

function rowToActivity(row : ActivityRow) : Activity {
    return {
        id : row.id,
        name : row.name,
        description : row.description,
        locationName : row.locationname,
        longitude : +row.startlongitude,
        latitude : +row.startlatitude,
        durationMinutes : row.durationminutes,
        categoryId : row.categoryid,
        categoryName : row.categoryname
    }
}

class Activities {

    /**
    * Creates a new activity in the database.
    * @returns Id of the created activity.
    */
    async createActivity(activity : Activity) : Promise<number> {
        let response =  await pool.query<{id : number}>(`
            INSERT INTO activities (id, name, description, locationname, startLongitude, startLatitude, durationminutes, categoryId)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id;
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

        return response.rows[0].id;
    }

    /**
    * Gets activity from the database by id
    * @returns The activity
    * @throws {NotFoundError} If the activity is not found.
    */
    async getActivity(id : number) : Promise<Activity> {
        let response = await pool.query<ActivityRow>(`
            SELECT a.id, a.name, a.description, a.locationname, a.startLatitude, a.startLongitude, a.durationminutes, a.categoryId, c.name categoryName
            FROM activities a
            JOIN activityCategories c ON a.categoryId = c.id
            WHERE a.id = $1;
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
    async editActivity(activity : Activity) : Promise<void> {
        let response = await pool.query<ActivityRow>(`
            UPDATE activities
            SET
                name = $2,
                description = $3,
                locationname = $4,
                startLongitude = $5,
                startLatitude = $6,
                durationminutes = $7,
                categoryId = $8
            WHERE id = $1;
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
    * Returns a page of all activities that satisfy the filters sorted alphabetically
    * @param page - the index of the page (1-indexed)
    * @param pageSize - the number of activities per page
    * @param categoryId - optional category filter
    * @param nameContains - optional search parameter
    * @returns array of activities that satisfy the filter and are on the required page
    * @throws {Error} - if page index is less then 1 or if page size out of bounds [1, 1000]
    */
    async getActivities(page : number, pageSize : number, categoryId? : number, nameContains? : string) : Promise<Activity[]> {
        if (page <= 0 || pageSize <= 0 || 1000 < pageSize) {
            throw new Error('Invalid paging parameters');
        }
        
        let response = await pool.query<ActivityRow>(`
            SELECT a.id, a.name, a.description, a.locationname, a.startLatitude, a.startLongitude, a.durationminutes, a.categoryId, c.name categoryName
            FROM activities a
            JOIN activityCategories c ON a.categoryId = c.id
            WHERE ($1::integer IS NULL OR c.id = $1)
            AND ($2::text IS NULL OR a.name ILIKE ('%' || $2 || '%'))
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
    * Creates a new activity category in the database.
    * @returns Id of the created category.
    */
    async createCategory(category : ActivityCategory) : Promise<number> {
        let response = await pool.query<{id : number}>(`
            INSERT INTO activityCategories (id, name)
            VALUES ($1, $2)
            RETURNING id;
        `, 
        [
            category.id,
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
        let response = await pool.query<ActivityCategory>(`
            SELECT *
            FROM activityCategories ac
            WHERE ac.id = $1;
        `,
        [id]);
        
        if (!response.rows[0]) {
            throw new NotFoundError('Category', id);
        }

        return response.rows[0];
    }

    /**
    * Updates an existing category by id.
    * @throws {NotFoundError} If no category with the specified ID exists.
    */
    async editCategory(category : ActivityCategory) : Promise<void> {
        let response = await pool.query<ActivityCategory>(`
            UPDATE activityCategories 
            SET name = $2
            WHERE id = $1;
        `,
        [
            category.id,
            category.name
        ]
        );

        if (!response.rowCount) {
            throw new NotFoundError('Category', category.id);
        }
    }

    /**
    * Returns all activity categories sorted alphabetically
    * @returns array of categories
    */
    async getCategories() : Promise<ActivityCategory[]> {
        let response = await pool.query<ActivityCategory>(
            `SELECT *
            FROM activityCategories
            ORDER BY name`
        );

        return response.rows;
    }

    /**
     * Get all the activites asigned to a trip in sequence order
     */
    async getTripActivities(tripId : number) : Promise<Activity[]> {
        let response = await pool.query<ActivityRow>(
            `SELECT a.id, a.name, a.description, a.locationname, a.startLatitude, a.startLongitude, a.durationminutes, a.categoryId, c.name categoryName
            FROM activities a
            JOIN tripActivities ta ON ta.activityId = a.id
            JOIN activityCategories c ON a.categoryId = c.id
            WHERE ta.tripId = $1
            ORDER BY ta.sequenceOrder`,
            [tripId]
        );

        return response.rows.map(rowToActivity);
    }
}

export const activities = new Activities();