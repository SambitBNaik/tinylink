import { Router } from "express";
import { createLink, deleteLink, getLink, listLinks, redirectToTarget } from "../controllers/linkController";

const router = Router();

router.post("/links", createLink);
router.get("/links", listLinks);
router.get("/links/:code", getLink);
router.delete("/links/:code",deleteLink);

router.get("/:code",redirectToTarget);

export default router;