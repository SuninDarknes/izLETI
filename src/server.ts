import express, { Request, Response } from "express";
import { checkDb } from "./connect.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.get("/health", async (req: Request, res: Response) => {
    const ok = await checkDb();
    res.status(ok ? 200 : 503).json({ status: ok ? "ok" : "error" });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});