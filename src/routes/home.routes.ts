import { Request, Response, Router } from "express";
import { GOOGLE_CLIENT_ID } from "../google-auth.config";
import { requireAdmin, requireLogin, requireOwner } from "../middleware/authorization";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
    res.render("home");
});

router.use(requireLogin);

router.get("/admin", requireAdmin, (req: Request, res: Response) => {
    res.render("admin");
});


router.get("/dashboard", requireOwner, (req: Request, res: Response) => {
    res.render("dashboard");
});


export default router;