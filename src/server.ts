




import express, {Request, Response} from "express";
import path from "node:path";
import session from "express-session";
import { checkDb } from "./connect.js";
import authRouter from "./routes/auth.routes";
import homeRouter from "./routes/home.routes";
import activitiesRouter from "./routes/activites.routes";
import eventsRouter from "./routes/events.routes";
import reservationsRouter from "./routes/reservations.routes";
import tripsRouter from "./routes/trips.routes";

const app = express();
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

app.use("/auth", authRouter);
app.use("/", homeRouter);
app.use("/activites", activitiesRouter);
app.use("/events", eventsRouter);
app.use("/reservations", reservationsRouter);
app.use("/trips", tripsRouter);

app.get("/health", async (req: Request, res: Response) => {
    const ok = await checkDb();
    res.status(ok ? 200 : 503).json({ status: ok ? "ok" : "error" });
});

const PORT = Number(process.env.PORT ?? 8080);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});