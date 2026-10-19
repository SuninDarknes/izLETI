import { Request, Response, Router } from "express";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
    // res.render("");
    return res.sendStatus(200);
});



router.get("/admin", (req: Request, res: Response) => {
    // res.render("");
    return res.sendStatus(200);
});


router.get("/dashboard", (req: Request, res: Response) => {
    // res.render("");
    return res.sendStatus(200);
});


export default router;