import express, {Request, Response} from "express";
import path from "node:path";
import session from "express-session";
import { checkDb } from "./connect.js";
import { requireLogin } from "./middleware/authorization";
import authRouter from "./routes/auth.routes";
import homeRouter from "./routes/home.routes";
import activitiesRouter from "./routes/activites.routes";
import eventsRouter from "./routes/events.routes";
import reservationsRouter from "./routes/reservations.routes";
import tripsRouter from "./routes/trips.routes";

const app = express();
app.set("trust proxy", 1);
const sessionSecret = process.env.SESSION_SECRET ?? "local-development-session-secret";

if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be configured in production.");
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        },
    }),
);

// middleware koji doda user za sve view-ove da se ne mora slati za svaki posebno
app.use((req: Request, res: Response, next) => {
    res.locals.user = req.session.user;
    next();
});

app.use("/auth", authRouter);
app.get("/health", async (req: Request, res: Response) => {
    const ok = await checkDb();
    res.status(ok ? 200 : 503).json({ status: ok ? "ok" : "error" });
});

app.use("/", homeRouter);
app.use("/activities", activitiesRouter);
app.use("/events", eventsRouter);
app.use("/reservations", reservationsRouter);
app.use("/trips", tripsRouter);

const PORT = Number(process.env.PORT ?? 8080);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});
