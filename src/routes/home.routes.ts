import { Request, Response, Router } from "express";
import { GOOGLE_CLIENT_ID } from "../google-auth.config";
import { requireAdmin, requireLogin, requireOwner } from "../middleware/authorization";
import { Role, User, users } from "../model/users.model";

const router: Router = Router();

const roleOptions = [
    { value: Role.User, label: "Korisnik", description: "Pregledava i rezervira izlete." },
    { value: Role.Organizer, label: "Organizator", description: "Upravlja aktivnostima, izletima i događajima." },
    { value: Role.Guide, label: "Vodič", description: "Vodi dodijeljene izlete." },
    { value: Role.Owner, label: "Vlasnik", description: "Pregledava statistiku i poslovne rezultate." },
    { value: Role.Admin, label: "Administrator", description: "Upravlja korisnicima i njihovim ulogama." },
];

function parseRoleNames(value: unknown): string[] | null {
    if (typeof value === "string") {
        return [value];
    }
    if (Array.isArray(value) && value.every(role => typeof role === "string")) {
        return value.filter((role): role is string => typeof role === "string");
    }
    return value === undefined ? [] : null;
}

router.get("/", (req: Request, res: Response) => {
    res.render("home");
});

router.use(requireLogin);

router.get("/admin", requireAdmin, async (req: Request, res: Response) => {
    const email = typeof req.query.email === "string" ? req.query.email.trim() : "";
    let targetUser: User | undefined;
    let targetRoles: string[] = [];
    let error: string | null = null;

    if (email) {
        try {
            targetUser = await users.findActiveUserByEmail(email);
            if (targetUser) {
                targetRoles = await users.getUserRoleNames(targetUser.id);
            } else {
                error = "Korisnik nije pronađen ili je deaktiviran.";
            }
        } catch (lookupError) {
            console.error("Could not look up a user for role management:", lookupError);
            res.status(500).send("Could not look up the user.");
            return;
        }
    }

    res.render("admin", {
        email,
        targetUser,
        targetRoles,
        roleOptions,
        error,
        success: req.query.updated === "1" && targetUser !== undefined,
    });
});

router.post("/admin/roles", requireAdmin, async (req: Request, res: Response) => {
    const email = typeof req.body.email === "string" ? req.body.email.trim() : "";
    const submittedRoles = parseRoleNames(req.body.roles);
    const selectedRoles = roleOptions
        .filter(option => submittedRoles?.includes(option.value))
        .map(option => option.value);
    const hasUnknownRole = submittedRoles?.some(
        role => !roleOptions.some(option => option.value === role),
    ) ?? false;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).render("admin", {
            email,
            targetUser: undefined,
            targetRoles: selectedRoles,
            roleOptions,
            error: "Unesite ispravnu e-mail adresu.",
            success: false,
        });
        return;
    }

    let targetUser: User | undefined;
    let currentRoles: string[];
    try {
        targetUser = await users.findActiveUserByEmail(email);
        if (!targetUser) {
            res.status(404).render("admin", {
                email,
                targetUser: undefined,
                targetRoles: selectedRoles,
                roleOptions,
                error: "Korisnik nije pronađen ili je deaktiviran.",
                success: false,
            });
            return;
        }
        currentRoles = await users.getUserRoleNames(targetUser.id);
    } catch (lookupError) {
        console.error("Could not look up a user for role assignment:", lookupError);
        res.status(500).send("Could not look up the user.");
        return;
    }

    const error = submittedRoles === null
        ? "Odabrane uloge nisu valjane."
        : hasUnknownRole
            ? "Odabrana je nevažeća uloga."
            : selectedRoles.length === 0
                ? "Odaberite barem jednu ulogu."
                : Number(req.session.user?.id) === targetUser.id &&
                    !selectedRoles.includes(Role.Admin)
                    ? "Ne možete ukloniti vlastitu administratorsku ulogu."
                    : null;

    if (error) {
        res.status(400).render("admin", {
            email,
            targetUser,
            targetRoles: submittedRoles === null ? currentRoles : selectedRoles,
            roleOptions,
            error,
            success: false,
        });
        return;
    }

    try {
        for (const role of selectedRoles) {
            if (!currentRoles.includes(role)) {
                await users.addRole(targetUser.id, role);
            }
        }
        for (const role of roleOptions) {
            if (currentRoles.includes(role.value) && !selectedRoles.includes(role.value)) {
                await users.removeRole(targetUser.id, role.value);
            }
        }
        res.redirect(`/admin?email=${encodeURIComponent(targetUser.email)}&updated=1`);
    } catch (updateError) {
        console.error("Could not update user roles:", updateError);
        res.status(500).send("Could not update user roles.");
    }
});


router.get("/dashboard", requireOwner, (req: Request, res: Response) => {
    res.render("dashboard");
});


export default router;