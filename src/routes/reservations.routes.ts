import { Request, Response, Router } from "express";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
    res.render("reservations");
    //return res.sendStatus(200);
});


router.get("/:id", (req: Request, res: Response) => {
    // res.render("");
    return res.sendStatus(200);
});


export default router;