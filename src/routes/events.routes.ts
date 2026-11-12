import { Request, Response, Router } from "express";
import { NotFoundError } from "../errors";
import { events, EventState, EventOrdering, SortDirection } from "../model/events.model";

const router: Router = Router();

const num = (v: unknown) =>
    typeof v === "string" && v !== "" && !isNaN(Number(v)) ? Number(v) : undefined;
const date = (v: unknown) =>
    typeof v === "string" && v !== "" ? new Date(v) : undefined;

router.get("/", async (req: Request, res: Response) => {
    const q = req.query;
    const ids = await events.getFilteredEvents(
        {
            nameContains: typeof q.q === "string" && q.q !== "" ? q.q : undefined,
            dateFrom: date(q.from),
            dateTo: date(q.to),
            priceFrom: num(q.priceFrom),
            priceTo: num(q.priceTo),
            states: [EventState.Scheduled],
        },
        1,
        50,
        { ordering: EventOrdering.byDate, direction: SortDirection.Ascending }
    );

    const list = await Promise.all(ids.map(id => events.getEvent(id)));
    res.render("events", { events: list, query: q });
});

router.get("/add", (req: Request, res: Response) => {
    return res.sendStatus(200);
});

router.get("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
        res.sendStatus(400);
        return;
    }

    try {
        res.render("event", { event: await events.getEvent(id) });
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.sendStatus(404);
            return;
        }
        throw error;
    }
});

router.get("/:id/reserve", (req: Request, res: Response) => {
    return res.sendStatus(200);
});

router.get("/:id/edit", (req: Request, res: Response) => {
    return res.sendStatus(200);
});

export default router;