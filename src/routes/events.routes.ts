import { Request, Response, Router } from "express";
import { NotFoundError } from "../errors";
import { events, EventState, EventOrdering, SortDirection } from "../model/events.model";
import { requireOrganizer } from "../middleware/authorization";
import { users } from "../model/users.model";

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
    const isOrganizer = req.session.user?.id
        ? await users.isOrganizer(Number(req.session.user.id))
        : false;
    res.render("events", { events: list, query: q, isOrganizer });
});

router.get("/add", requireOrganizer, (req: Request, res: Response) => {
    res.render("event-form", {
        error: null,
        values: { tripId: "", startDateTime: "", capacity: "" },
    });
});

router.post("/add", requireOrganizer, async (req: Request, res: Response) => {
    const tripId = typeof req.body.tripId === "string" ? Number(req.body.tripId) : NaN;
    const startDateTimeValue = typeof req.body.startDateTime === "string"
        ? req.body.startDateTime
        : "";
    const capacity = typeof req.body.capacity === "string" ? Number(req.body.capacity) : NaN;
    const startDateTime = new Date(startDateTimeValue);
    const values = {
        tripId: typeof req.body.tripId === "string" ? req.body.tripId : "",
        startDateTime: startDateTimeValue,
        capacity: typeof req.body.capacity === "string" ? req.body.capacity : "",
    };

    if (
        !Number.isSafeInteger(tripId) || tripId <= 0 ||
        !Number.isFinite(startDateTime.getTime()) ||
        !Number.isSafeInteger(capacity) || capacity <= 0
    ) {
        res.status(400).render("event-form", {
            error: "Unesite valjan ID izleta, datum i vrijeme te pozitivan kapacitet.",
            values,
        });
        return;
    }

    try {
        const eventId = await events.createEvent({
            startDateTime,
            capacity,
            state: EventState.Scheduled,
        }, tripId, []);
        res.redirect(`/events/${eventId}`);
    } catch (error) {
        if (error instanceof NotFoundError) {
            res.status(400).render("event-form", {
                error: "Izlet s navedenim ID-om ne postoji.",
                values,
            });
            return;
        }

        console.error("Could not create event:", error);
        res.status(500).send("Could not create event.");
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
        res.sendStatus(400);
        return;
    }

    try {
       // res.render("event", { event: await events.getEvent(id) });
        res.render("event", { event:1});

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