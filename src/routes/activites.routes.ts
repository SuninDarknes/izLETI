import { Request, Response, Router } from "express";
import { NotFoundError } from "../errors";
import { requireOrganizer } from "../middleware/authorization";
import { activities, NewActivity } from "../model/activities.model";
import { users } from "../model/users.model";

const router: Router = Router();

const n = (v: unknown) => (v === undefined || v === "" ? NaN : Number(v));

function parseActivity(b: any): NewActivity | null {
    const a = {
        name: String(b.name ?? "").trim(),
        description: String(b.description ?? "").trim(),
        locationName: String(b.locationName ?? "").trim(),
        latitude: n(b.latitude),
        longitude: n(b.longitude),
        durationMinutes: b.durationMinutes === undefined || b.durationMinutes === ""
            ? null
            : n(b.durationMinutes),
        categoryId: n(b.categoryId),
    };
    const ok = a.name !== "" &&
        [a.latitude, a.longitude, a.categoryId].every(Number.isFinite) &&
        (a.durationMinutes === null || Number.isFinite(a.durationMinutes));
    return ok ? a : null;
}

// Trajanje iz filtera: kratko (do 1 h), srednje (1-2 h), dugo (vise od 2 h)
const DURATIONS: Record<string, { min?: number; max?: number }> = {
    short: { max: 60 },
    medium: { min: 60, max: 120 },
    long: { min: 120 },
};

const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");

router.get("/", async (req: Request, res: Response) => {
    const q = text(req.query.q);
    const location = text(req.query.location);
    const durationKey = text(req.query.duration);
    const duration = DURATIONS[durationKey];
    const categoryId = Number(req.query.categoryId);
    const category = Number.isSafeInteger(categoryId) && categoryId > 0 ? categoryId : undefined;

    try {
        const [activityList, categories, isOrganizer] = await Promise.all([
            activities.filterActivities(
                1,
                100,
                category,
                q || undefined,
                location || undefined,
                duration?.min,
                duration?.max
            ),
            activities.getCategories(),
            req.session.user?.id
                ? users.isOrganizer(Number(req.session.user.id))
                : Promise.resolve(false),
        ]);
        res.render("activites", {
            activities: activityList,
            categories,
            query: {
                q,
                location,
                categoryId: category ?? null,
                duration: duration ? durationKey : "",
            },
            isOrganizer,
        });
    } catch (error) {
        console.error("Could not load activities:", error);
        res.status(500).send("Could not load activities.");
    }
});

router.get("/add", requireOrganizer, async (req: Request, res: Response) => {
    res.render("activity-form", {
        activity: null,
        isEditing: false,
        categories: await activities.getCategories(),
        error: null,
    });
});

router.post("/add", requireOrganizer, async (req: Request, res: Response) => {
    const a = parseActivity(req.body);
    if (!a) {
        res.status(400).render("activity-form", {
            activity: req.body,
            isEditing: false,
            categories: await activities.getCategories(),
            error: "Provjeri unesena polja.",
        });
        return;
    }

    try {
        const id = await activities.createActivity(a);
        res.redirect(`/activities/${id}`);
    } catch (error) {
        console.error("Could not create activity:", error);
        res.status(400).render("activity-form", {
            activity: req.body,
            isEditing: false,
            categories: await activities.getCategories(),
            error: "Aktivnost nije spremljena. Provjeri kategoriju i ostala polja.",
        });
    }
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

        const isOrganizer = req.session.user?.id
            ? await users.isOrganizer(Number(req.session.user.id))
            : false;
        res.render("activity", { activity, isOrganizer });
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
            isEditing: true,
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
    if (!Number.isSafeInteger(id) || id <= 0) {
        res.sendStatus(400);
        return;
    }

    const a = parseActivity(req.body);
    if (!a) {
        res.status(400).render("activity-form", {
            activity: { ...req.body, id },
            isEditing: true,
            categories: await activities.getCategories(),
            error: "Provjeri unesena polja.",
        });
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
        console.error("Could not edit activity:", error);
        res.status(400).render("activity-form", {
            activity: { ...req.body, id },
            isEditing: true,
            categories: await activities.getCategories(),
            error: "Promjene nisu spremljene. Provjeri kategoriju i ostala polja.",
        });
    }
});

export default router;