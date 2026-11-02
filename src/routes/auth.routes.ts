import { OAuth2Client } from "google-auth-library";
import { Request, Response, Router } from "express";
import pool from "../connect";
import { GOOGLE_CLIENT_ID } from "../google-auth.config";

declare module "express-session" {
    interface SessionData {
        user?: {
            id: string;
            email: string;
            name?: string;
            picture?: string;
        };
    }
}

const router: Router = Router();
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

router.post("/google", async (req: Request, res: Response) => {
    const credential: unknown = req.body?.credential;
    if (typeof credential !== "string" || credential.length === 0) {
        res.status(400).json({ error: "A Google credential is required." });
        return;
    }

    let payload;
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
    } catch (error) {
        console.error("Google credential verification failed:", error);
        res.status(401).json({ error: "Google sign-in could not be verified. Please try again." });
        return;
    }

    if (!payload?.sub || !payload.email || payload.email_verified !== true) {
        res.status(401).json({ error: "Google did not provide a verified account." });
        return;
    }

    const email = payload.email.toLowerCase();
    const fullName = payload.name ?? email;
    let client;
    try {
        client = await pool.connect();
    } catch (error) {
        console.error("Could not connect to the database during Google sign-in:", error);
        res.status(503).json({ error: "The database is unavailable. Please try again." });
        return;
    }

    let user: { id: number; email: string; fullname: string; active: boolean };
    try {
        await client.query("BEGIN");
        await client.query("SELECT pg_advisory_xact_lock(761204)");

        const existingUsers = await client.query<{
            id: number;
            email: string;
            googleid: string;
            fullname: string;
            active: boolean;
        }>(
            `SELECT id, email, googleid, fullname, active
             FROM users
             WHERE googleid = $1 OR lower(email) = $2
             FOR UPDATE`,
            [payload.sub, email],
        );
        const googleUser = existingUsers.rows.find(row => row.googleid === payload.sub);
        const emailUser = existingUsers.rows.find(row => row.email.toLowerCase() === email);

        if (emailUser && emailUser.googleid !== payload.sub) {
            await client.query("ROLLBACK");
            res.status(409).json({
                error: "An account already uses this email. Please contact an administrator to link it.",
            });
            return;
        }

        if (googleUser) {
            if (!googleUser.active) {
                await client.query("ROLLBACK");
                res.status(403).json({ error: "This account is inactive." });
                return;
            }

            const result = await client.query<{
                id: number;
                email: string;
                fullname: string;
                active: boolean;
            }>(
                `UPDATE users
                 SET email = $1,
                     fullname = $2,
                     givenname = $3,
                     familyname = $4,
                     picture = $5,
                     locale = $6,
                     emailverified = $7
                 WHERE id = $8
                 RETURNING id, email, fullname, active`,
                [
                    email,
                    fullName,
                    payload.given_name ?? null,
                    payload.family_name ?? null,
                    payload.picture ?? null,
                    payload.locale ?? null,
                    payload.email_verified === true,
                    googleUser.id,
                ],
            );
            user = result.rows[0];
        } else {
            const result = await client.query<{
                id: number;
                email: string;
                fullname: string;
                active: boolean;
            }>(
                `INSERT INTO users (
                     email, googleid, createdat, fullname, active,
                     givenname, familyname, picture, locale, emailverified
                 )
                 VALUES ($1, $2, CURRENT_TIMESTAMP, $3, TRUE, $4, $5, $6, $7, $8)
                 RETURNING id, email, fullname, active`,
                [
                    email,
                    payload.sub,
                    fullName,
                    payload.given_name ?? null,
                    payload.family_name ?? null,
                    payload.picture ?? null,
                    payload.locale ?? null,
                    payload.email_verified === true,
                ],
            );
            user = result.rows[0];
        }

        let roleResult = await client.query<{ id: number }>(
            "SELECT id FROM roles WHERE name = $1",
            ["Customer"],
        );
        if (roleResult.rowCount === 0) {
            roleResult = await client.query<{ id: number }>(
                `INSERT INTO roles (id, name, active)
                 SELECT COALESCE(MAX(id), 0) + 1, $1, TRUE
                 FROM roles
                 ON CONFLICT (name) DO NOTHING
                 RETURNING id`,
                ["Customer"],
            );
            if (roleResult.rowCount === 0) {
                roleResult = await client.query<{ id: number }>(
                    "SELECT id FROM roles WHERE name = $1",
                    ["Customer"],
                );
            }
        }

        if (roleResult.rowCount !== 1) {
            throw new Error('Could not find or create the "Customer" role.');
        }

        await client.query(
            `INSERT INTO userrole (roleid, userid)
             VALUES ($1, $2)
             ON CONFLICT (roleid, userid) DO NOTHING`,
            [roleResult.rows[0].id, user.id],
        );

        await client.query("COMMIT");
    } catch (error) {
        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.error("Could not roll back the Google sign-in transaction:", rollbackError);
        }
        console.error("Could not save the Google user and role:", error);
        res.status(500).json({ error: "Could not save your account. Please try again." });
        return;
    } finally {
        client.release();
    }

    try {
        await new Promise<void>((resolve, reject) => {
            req.session.regenerate(error => error ? reject(error) : resolve());
        });
        req.session.user = {
            id: String(user.id),
            email: user.email,
            name: user.fullname,
            picture: payload.picture,
        };
        await new Promise<void>((resolve, reject) => {
            req.session.save(error => error ? reject(error) : resolve());
        });

        res.json({ redirectUrl: "/home" });
    } catch (error) {
        console.error("Could not create a session after Google sign-in:", error);
        res.status(500).json({ error: "Google sign-in succeeded, but a session could not be created." });
    }
});

export default router;
