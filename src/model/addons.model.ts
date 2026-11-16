import { Pool, PoolClient } from 'pg'
import pool from '../connect'
import { NotFoundError } from '../errors'

export type NewAddon = {
    name : string,
    defaultPrice : number
}

export type Addon = NewAddon & {
    id : number
}

export type EditAddon = Addon;

type AddonRow = {
    id : number,
    name : string,
    defaultprice : string,
    active : boolean
}

function rowToAddon(row : AddonRow) : Addon {
    return {
        id : row.id,
        name : row.name,
        defaultPrice : +row.defaultprice,
    }
}


class Addons {

    // ======================================================================================================================
    // ====================================================ADDONS============================================================
    // ======================================================================================================================


    /**
     * Checks whether an addon with the id exists.
     */
    async exists(id : number, client : Pool | PoolClient = pool) : Promise<boolean> {
        let response = await client.query(`
            SELECT id
            FROM addons
            WHERE id = $1
        `,
        [id]);

        return response.rowCount != 0;
    }

    /**
    * Creates a new addon in the database.
    * @returns Id of the created addon.
    */
    async createAddon(addon : NewAddon) : Promise<number> {
        let response =  await pool.query<{id : number}>(`
            INSERT INTO addons (name, defaultPrice, active)
            VALUES ($1, $2, true)
            RETURNING id;
        `, 
        [
            addon.name,
            addon.defaultPrice
        ]
        );

        return response.rows[0].id;
    }

    /**
    * Gets an addon from the database by id.
    * @throws {NotFoundError} If the addon is not found or is inactive.
    */
    async getAddon(id : number) : Promise<Addon> {
        let response = await pool.query<AddonRow>(`
            SELECT a.*
            FROM addons a
            WHERE a.id = $1
            AND a.active = true;
        `,
        [id]);

        if (!response.rowCount) {
            throw new NotFoundError('Addon', id);
        }

        return rowToAddon(response.rows[0]);
    }

    /**
    * Updates an existing addon by id.
    * @throws {NotFoundError} If no active addon with the specified id exists.
    */
    async editAddon(addon : EditAddon) : Promise<void> {
        let response = await pool.query(`
            UPDATE addons
            SET
                name = $2,
                defaultPrice = $3
            WHERE id = $1
            AND active = true;
        `,
        [
            addon.id,
            addon.name,
            addon.defaultPrice
        ]
        );

        if (!response.rowCount) {
            throw new NotFoundError('Addon', addon.id);
        }
    }

    /**
     * 'Deletes' an existing addon by setting its active column to false.
     * @throws {NotFoundError} If no addon with the specified id exists.
     */
    async deleteAddon(id : number) : Promise<void> {
        let response = await pool.query(`
            UPDATE addons
            SET active = false
            WHERE id = $1
        `,
        [id]);

        if (!response.rowCount) { 
            throw new NotFoundError('Addon', id);
        }
    }

}

export const addons = new Addons();