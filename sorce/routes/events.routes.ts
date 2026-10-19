import { Request, Response, Router } from "express";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
    // res.render("");
    return res.sendStatus(200);
});


router.get("/:id", (req: Request, res: Response) => {
    // res.render("");
    return res.sendStatus(200);
});


router.get("/:id/reserve", (req: Request, res: Response) => {
    // res.render("");
    return res.sendStatus(200);
});

router.get("/:id/edit", (req: Request, res: Response) => {
    // res.render("");
    return res.sendStatus(200);
});


router.get("/add", (req: Request, res: Response) => {
    // res.render("");
    return res.sendStatus(200);
});





export default router;