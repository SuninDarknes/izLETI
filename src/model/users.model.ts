import pool from '../connect'
import { NotFoundError } from '../errors';

export type EditUser = {
    id : number,
    phone : string | null,
    username : string,
    firstName : string | null,
    lastName : string | null,
    picture : string | null,
    locale : string | null,
    emailVerified : boolean
}

export type NewUser = {
    email : string,
    phone : string | null,
    username : string,
    firstName : string | null,
    lastName : string | null,
    picture : string | null,
    locale : string | null,
    emailVerified : boolean,
    googleId : string
}

export type User = NewUser & {
    id : number,
    createdAt : Date
}

export enum Role {
    User = "user",
    Admin = "admin",
    Organizer = "organizer",
    Owner = "owner",
    Guide = "guide"
}

type UserRow = {
    id : number,
    email : string,
    googleid : string,
    phone : string | null,
    username : string,
    firstname : string | null,
    lastname : string | null,
    picture : string | null,
    locale : string | null,
    emailverified : boolean,
    createdat : Date
}

function rowToUser(row : UserRow) : User {
    return {
        id : row.id,
        email : row.email,
        googleId : row.googleid,
        phone : row.phone,
        username : row.username,
        firstName : row.firstname,
        lastName : row.lastname,
        picture : row.picture,
        locale : row.locale,
        emailVerified : row.emailverified,
        createdAt : row.createdat
    }
}

class Users {

    // ======================================================================================================================
    // =====================================================USERS============================================================
    // ======================================================================================================================

    /**
    * Creates a new active user and assigns the given roles, all in a single transaction.
    * @param user - the user to create
    * @param roles - roles to assign to the user (defaults to just the User role). Duplicates are ignored.
    * @returns Id of the created user.
    * @throws {Error} If one of the roles does not exist (the user is not created), or if the database
    *                 rejects the insert (e.g. the email or googleId is already taken).
    */
    async createUser(user : NewUser, roles : Role[] = [Role.User]) : Promise<number> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            let response = await client.query<{id : number}>(`
                INSERT INTO users (email, googleid, phone, username,
                    firstname, lastname, picture, locale, emailverified, createdat, active)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, true)
                RETURNING id;
            `, 
            [
                user.email,
                user.googleId,
                user.phone,
                user.username,
                user.firstName,
                user.lastName,
                user.picture,
                user.locale,
                user.emailVerified
            ]);
            let id = response.rows[0].id;

            for (let role of new Set(roles)) {
                let roleResult = await client.query(`
                    INSERT INTO userRole (userId, roleId)
                    SELECT $1, id FROM roles WHERE LOWER(name) = LOWER($2)
                `, [id, role]);

                if (!roleResult.rowCount) {
                    throw new Error(`Unknown role: ${role}`);
                }
            }

            await client.query('COMMIT');
            return id;
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
    * Gets an active user from the database by id
    * @returns The user
    * @throws {NotFoundError} If the user is not found or is inactive.
    */
    async getUser(id : number) : Promise<User> {
        let response = await pool.query<UserRow>(`
            SELECT *
            FROM users
            WHERE id = $1
            AND active = true;
        `,
        [id]);
        
        if (!response.rows[0]) {
            throw new NotFoundError("User", id);
        }

        return rowToUser(response.rows[0]);
    }

    /**
    * Gets an active user from the database by their Google account id
    * @param googleId - the id of the user's Google account
    * @returns The user
    * @throws {NotFoundError} If no active user with the specified Google id exists.
    */
    async getUserByGoogleId(googleId : string) : Promise<User> {
        let response = await pool.query<UserRow>(`
            SELECT *
            FROM users
            WHERE googleid = $1
            AND active = true;
        `,
        [googleId]);
        
        if (!response.rows[0]) {
            throw new NotFoundError("User");
        }

        return rowToUser(response.rows[0]);
    }

    /**
    * Updates the editable profile fields of an active user by id.
    * @throws {NotFoundError} If no active user with the specified ID exists.
    */
    async editUser(user : EditUser) : Promise<void> {
        let response = await pool.query(`
            UPDATE users
            SET
                phone = $2,
                username = $3,
                firstname = $4,
                lastname = $5,
                picture = $6,
                locale = $7,
                emailverified = $8
            WHERE id = $1
            AND active = true;
        `,
        [
            user.id,
            user.phone,
            user.username,
            user.firstName,
            user.lastName,
            user.picture,
            user.locale,
            user.emailVerified
        ]
        );
    
        if (!response.rowCount) {
            throw new NotFoundError('User', user.id);
        }
    }

    /**
    * 'Deletes' an existing user (by setting the active column to false).
    * @throws {NotFoundError} If no user with the specified id exists
    */
    async deleteUser(id : number) : Promise<void> {
        let response = await pool.query(`
            UPDATE users
            SET active = false
            WHERE id = $1;
        `,
        [id]);

        if (!response.rowCount) {
            throw new NotFoundError('User', id);
        }
    }

    /**
    * Reactivates a previously deleted user (by setting the active column to true).
    * @throws {NotFoundError} If no user with the specified id exists
    */
    async reactivateUser(id : number) : Promise<void> {
        let response = await pool.query(`
            UPDATE users
            SET active = true
            WHERE id = $1;
        `,
        [id]);

        if (!response.rowCount) {
            throw new NotFoundError('User', id);
        }
    }

    // ======================================================================================================================
    // =====================================================ROLES============================================================
    // ======================================================================================================================

    /**
    * Assigns a role to a user.
    * @throws {Error} If the user or the role does not exist, or if the user already has the role.
    */
    async addRole(userId : number, role : Role) : Promise<void> {
        await pool.query(`
                INSERT INTO userRole (userId, roleId)
                VALUES (
                $1,
                (SELECT id FROM roles WHERE LOWER(name) = LOWER($2))
                )
            `, [userId, role]);
    }

    /**
    * Removes a role from a user.
    * @throws {NotFoundError} If the user does not have the specified role.
    */
    async removeRole(userId : number, role : Role) : Promise<void>{
        let response = await pool.query(`
            DELETE FROM userRole
            WHERE userId = $1
            AND roleId = (SELECT id FROM roles WHERE LOWER(name) = LOWER($2))
        `, [userId, role]);

        if (!response.rowCount) {
            throw new NotFoundError('User or Role');
        }
    }

    /**
    * Checks whether a user has the given role.
    * @returns true if the user exists, is active and has the role, false otherwise.
    */
    private async hasRole(id : number, role : Role) : Promise<boolean> {
        let response = await pool.query(`
            SELECT 1 FROM
            users
            JOIN userRole ON userRole.userId = users.id
            JOIN roles ON roles.id = userRole.roleId
            WHERE users.id = $1
            AND LOWER(roles.name) = LOWER($2)
            AND users.active = true;
        `,
        [id, role]);

        return response.rows.length > 0;
    }

    /**
    * Checks whether a user has the User role.
    * @returns true if the user exists, is active and has the role, false otherwise.
    */
    async isUser(id : number) : Promise<boolean>{
        return this.hasRole(id, Role.User);
    }

    /**
    * Checks whether a user has the Admin role.
    * @returns true if the user exists, is active and has the role, false otherwise.
    */
    async isAdmin(id : number) : Promise<boolean>{
        return this.hasRole(id, Role.Admin);
    }

    /**
    * Checks whether a user has the Owner role.
    * @returns true if the user exists, is active and has the role, false otherwise.
    */
    async isOwner(id : number) : Promise<boolean>{
        return this.hasRole(id, Role.Owner);
    }

    /**
    * Checks whether a user has the Organizer role.
    * @returns true if the user exists, is active and has the role, false otherwise.
    */
    async isOrganizer(id : number) : Promise<boolean>{
        return this.hasRole(id, Role.Organizer);
    }

    /**
    * Checks whether a user has the Guide role.
    * @returns true if the user exists, is active and has the role, false otherwise.
    */
    async isGuide(id : number) : Promise<boolean>{
        return this.hasRole(id, Role.Guide);
    }
}

export const users = new Users();