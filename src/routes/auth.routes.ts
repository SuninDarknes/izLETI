import { OAuth2Client } from "google-auth-library";
import { Request, Response, Router } from "express";
import { NotFoundError } from "../errors";
import { GOOGLE_CLIENT_ID } from "../google-auth.config";
import { Role, User, users } from "../model/users.model";

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

function isPostgresError(error: unknown): error is Error & { code: string; constraint?: string } {
    return error instanceof Error
        && "code" in error
        && typeof error.code === "string";
}

router.post("/logout", (req: Request, res: Response) => {
    req.session.destroy(error => {
        if (error) {
            console.error("Could not destroy the session during logout:", error);
            res.status(500).send("Could not log out. Please try again.");
            return;
        }

        res.clearCookie("connect.sid", { path: "/" });
        res.redirect("/login");
    });
});

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
    let user: User;
    try {
        try {
            user = await users.getUserByGoogleId(payload.sub);
        } catch (error) {
            if (!(error instanceof NotFoundError)) {
                throw error;
            }

            try {
                await users.createUser({
                    email,
                    phone: null,
                    username: email.split("@")[0].slice(0, 100),
                    firstName: payload.given_name ?? null,
                    lastName: payload.family_name ?? null,
                    picture: payload.picture ?? null,
                    locale: payload.locale ?? null,
                    emailVerified: payload.email_verified === true,
                    googleId: payload.sub,
                }, [Role.User]);
                user = await users.getUserByGoogleId(payload.sub);
            } catch (createError) {
                if (isPostgresError(createError) && createError.code === "23505") {
                    if (createError.constraint?.toLowerCase().includes("googleid")) {
                        try {
                            user = await users.getUserByGoogleId(payload.sub);
                        } catch (lookupError) {
                            if (!(lookupError instanceof NotFoundError)) {
                                throw lookupError;
                            }
                            res.status(403).json({ error: "This account is inactive." });
                            return;
                        }
                    }
                    else if (createError.constraint?.toLowerCase().includes("email")) {
                        res.status(409).json({
                            error: "An account already uses this email. Please contact an administrator to link it.",
                        });
                        return;
                    }
                }
                throw createError;
            }
        }

        await users.editUser({
            id: user.id,
            phone: user.phone,
            username: user.username,
            firstName: payload.given_name ?? user.firstName,
            lastName: payload.family_name ?? user.lastName,
            picture: payload.picture ?? user.picture,
            locale: payload.locale ?? user.locale,
            emailVerified: payload.email_verified === true,
        });
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(403).json({ error: "This account is inactive." });
            return;
        }

        console.error("Could not save the Google user and role:", error);
        if (isPostgresError(error) && (error.code.startsWith("08") || [
            "ECONNREFUSED",
            "ENOTFOUND",
            "ETIMEDOUT",
        ].includes(error.code))) {
            res.status(503).json({ error: "The database is unavailable. Please try again." });
            return;
        }
        res.status(500).json({ error: "Could not save your account. Please try again." });
        return;
    }

    try {
        await new Promise<void>((resolve, reject) => {
            req.session.regenerate(error => error ? reject(error) : resolve());
        });
        req.session.user = {
            id: String(user.id),
            email: user.email,
            name: [user.firstName, user.lastName].filter(Boolean).join(" ") || fullName,
            picture: payload.picture,
        };
        await new Promise<void>((resolve, reject) => {
            req.session.save(error => error ? reject(error) : resolve());
        });

        res.json({ redirectUrl: "/" });
    } catch (error) {
        console.error("Could not create a session after Google sign-in:", error);
        res.status(500).json({ error: "Google sign-in succeeded, but a session could not be created." });
    }
});

export default router;
