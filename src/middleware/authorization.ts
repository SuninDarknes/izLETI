import { RequestHandler } from "express";
import { users } from "../model/users.model";

export function safeReturnTo(value: unknown): string {
    if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
        return "/";
    }

    try {
        const destination = new URL(value, "http://localhost");
        if (destination.origin !== "http://localhost") {
            return "/";
        }
        return `${destination.pathname}${destination.search}${destination.hash}`;
    } catch {
        return "/";
    }
}

export const requireLogin: RequestHandler = (req, res, next) => {
    if (!req.session.user?.id) {
        res.redirect(`/auth/login?returnTo=${encodeURIComponent(req.originalUrl)}`);
        return;
    }

    next();
};

export const requireAdmin: RequestHandler = async (req, res, next) => {
    const userId = req.session.user?.id;
    if (!userId) {
        res.redirect("/auth/login");
        return;
    }

    try {
        if (!(await users.isAdmin(Number(userId)))) {
            res.status(403).render("forbidden");
            return;
        }

        next();
    } catch (error) {
        console.error("Could not verify admin access:", error);
        res.status(503).send("Unable to verify permissions right now. Please try again.");
    }
};

export const requireOwner: RequestHandler = async (req, res, next) => {
    const userId = req.session.user?.id;
    if (!userId) {
        res.redirect(`/auth/login?returnTo=${encodeURIComponent(req.originalUrl)}`);
        return;
    }

    try {
        if (!(await users.isOwner(Number(userId)))) {
            res.status(403).render("forbidden");
            return;
        }

        next();
    } catch (error) {
        console.error("Could not verify owner access:", error);
        res.status(503).send("Unable to verify permissions right now. Please try again.");
    }
};

export const requireOrganizer: RequestHandler = async (req, res, next) => {
    const userId = req.session.user?.id;
    if (!userId) {
        res.redirect(`/auth/login?returnTo=${encodeURIComponent(req.originalUrl)}`);
        return;
    }

    try {
        if (!(await users.isOrganizer(Number(userId)))) {
            res.status(403).render("forbidden");
            return;
        }

        next();
    } catch (error) {
        console.error("Could not verify organizer access:", error);
        res.status(503).send("Unable to verify permissions right now. Please try again.");
    }
};
