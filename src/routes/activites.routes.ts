import { Request, Response, Router } from "express";
import { NotFoundError } from "../errors";
import { requireOrganizer } from "../middleware/authorization";
import { activities, NewActivity } from "../model/activities.model";

const router: Router = Router();

const n = (v: unknown) => (v === undefined || v === "" ? NaN : Number(v));

function parseActivity(b: any): NewActivity | null {
    const a = {
        name: String(b.name ?? "").trim(),
        description: String(b.description ?? "").trim(),
        locationName: String(b.locationName ?? "").trim(),
        latitude: n(b.latitude),
        longitude: n(b.longitude),
        durationMinutes: n(b.durationMinutes),
        categoryId: n(b.categoryId),
    };
    const ok = a.name !== "" &&
        [a.latitude, a.longitude, a.durationMinutes, a.categoryId].every(Number.isFinite);
    return ok ? a : null;
}

router.get("/", async (req: Request, res: Response) => {
    try {
        const activityList = await activities.filterActivities(1, 100);
        res.render("activites", { activities: activityList });
    } catch (error) {
        console.error("Could not load activities:", error);
        res.status(500).send("Could not load activities.");
    }
});

router.get("/add", requireOrganizer, async (req: Request, res: Response) => {
    res.render("activity-form", {
        activity: null,
        categories: await activities.getCategories(),
        error: null,
    });
});

router.post("/add", requireOrganizer, async (req: Request, res: Response) => {
    const a = parseActivity(req.body);
    if (!a) {
        res.status(400).render("activity-form", {
            activity: req.body,
            categories: await activities.getCategories(),
            error: "Provjeri unesena polja.",
        });
        return;
    }

    const id = await activities.createActivity(a);
    res.redirect(`/activities/${id}`);
});

router.get("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
        res.status(400).json({ error: "Activity id must be a positive integer." });
        return;
    }

    try {
        const activity = await activities.getActivity(id);
        if (req.accepts(["html", "json"]) === "json") {
            res.json(activity);
            return;
        }

        res.render("activity", { activity });
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(404).send("Activity not found.");
            return;
        }

        console.error("Could not load activity:", error);
        res.status(500).json({ error: "Could not load activity." });
    }
});

router.get("/:id/edit", requireOrganizer, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
        res.sendStatus(400);
        return;
    }

    try {
        res.render("activity-form", {
            activity: await activities.getActivity(id),
            categories: await activities.getCategories(),
            error: null,
        });
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.sendStatus(404);
            return;
        }
        throw error;
    }
});

router.post("/:id/edit", requireOrganizer, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const a = parseActivity(req.body);
    if (!Number.isSafeInteger(id) || id <= 0 || !a) {
        res.sendStatus(400);
        return;
    }

    try {
        await activities.editActivity({ id, ...a });
        res.redirect(`/activities/${id}`);
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.sendStatus(404);
            return;
        }
        throw error;
    }
});

export default router;