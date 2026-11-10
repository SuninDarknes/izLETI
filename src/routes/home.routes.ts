import { Request, Response, Router } from "express";
import { GOOGLE_CLIENT_ID } from "../google-auth.config";
import { requireAdmin } from "../middleware/authorization";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
    res.render("login", { googleClientId: GOOGLE_CLIENT_ID });
});

router.get("/home", (req: Request, res: Response) => {
    res.render("home");
});

router.get("/admin", requireAdmin, (req: Request, res: Response) => {
    res.render("admin");
});


router.get("/dashboard", (req: Request, res: Response) => {
    res.render("dashboard");
});


export default router;