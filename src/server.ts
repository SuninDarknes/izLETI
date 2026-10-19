import express from "express";
import path from "node:path";
import session from "express-session";

import homeRouter from "./routes/home.routes";
import activitiesRouter from "./routes/activites.routes";
import eventsRouter from "./routes/events.routes";
import reservationsRouter from "./routes/reservations.routes";
import tripsRouter from "./routes/trips.routes";

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "izLET",
        resave: false,
        saveUninitialized: true,
    }),
);

app.use("/", homeRouter);
app.use("/activites", activitiesRouter);
app.use("/events", eventsRouter);
app.use("/reservations", reservationsRouter);
app.use("/trips", tripsRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});