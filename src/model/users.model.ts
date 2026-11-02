import pool from '../connect'
import { QueryResult } from 'pg';

export type User = {
    id : number,
    name : string,
    email : string
}

type UserRow = {
    id : number,
    email : string,
    fullname : string
}

function rowToUser(row : UserRow) : User {
    return {
        id : row.id,
        name : row.fullname,
        email : row.email
    }
}

class Users {
    async getUser(id : number) : Promise<User> {
        let response : QueryResult = await pool.query<UserRow>(`
            SELECT id, email, fullname FROM users
            WHERE id = $1
            AND active = true;
        `,
        [id]);
        
        if (!response.rows[0]) {
            throw new Error("User not found");
        }

        return rowToUser(response.rows[0]);
    }

    async hasRole(id : number, role : string) : Promise<boolean> {
        let response : QueryResult = await pool.query(`
            SELECT 1 FROM
            users
            JOIN userRole ON userRole.userId = users.id
            JOIN roles ON roles.id = userRole.roleId
            WHERE users.id = $1
            AND LOWER(roles.name) = $2
            AND users.active = true
            /* AND userRole.active = true */;
        `,
        [id, role.toLowerCase()]);

        return response.rows.length > 0;
    }

    async isAdmin(id : number) : Promise<boolean>{
        return this.hasRole(id, 'admin');
    }
}

export const users = new Users();