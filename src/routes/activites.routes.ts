import { Request, Response, Router } from "express";
import { NotFoundError } from "../errors";
import { activities } from "../model/activities.model";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const activityList = await activities.filterActivities(1, 100);
        res.render("activites", { activities: activityList });
    } catch (error) {
        console.error("Could not load activities:", error);
        res.status(500).send("Could not load activities.");
    }
});

router.get("/add", (req: Request, res: Response) => {
    return res.sendStatus(200);
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


router.get("/:id/edit", (req: Request, res: Response) => {
    // res.render("");
    return res.sendStatus(200);
});


export default router;