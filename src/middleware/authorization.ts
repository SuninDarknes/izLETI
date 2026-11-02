import { RequestHandler } from "express";
import { users } from "../model/users.model";

export const requireAdmin: RequestHandler = async (req, res, next) => {
    const userId = req.session.user?.id;
    if (!userId) {
        res.redirect("/");
        return;
    }

    try {
        if (!(await users.isAdmin(Number(userId)))) {
            res.redirect("/home");
            return;
        }

        next();
    } catch (error) {
        console.error("Could not verify admin access:", error);
        res.status(503).send("Unable to verify permissions right now. Please try again.");
    }
};
