import { Request, Response, Router } from "express";
import { GOOGLE_CLIENT_ID } from "../google-auth.config";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
    res.render("login", { googleClientId: GOOGLE_CLIENT_ID });
   // return res.sendStatus(200);
});



router.get("/admin", (req: Request, res: Response) => {
    res.render("admin");
    //return res.sendStatus(200);
});


router.get("/dashboard", (req: Request, res: Response) => {
    res.render("dashboard");
    //return res.sendStatus(200);
});


export default router;