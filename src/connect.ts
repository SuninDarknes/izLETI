import pg from "pg";

const pool = new pg.Pool({
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export async function checkDb(): Promise<boolean> {
    try {
        await pool.query("SELECT 1");
        return true;
    } catch {
        return false;
    }
}

export default pool;