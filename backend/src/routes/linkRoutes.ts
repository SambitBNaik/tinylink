import { Router } from "express";
import { createLink, deleteLink, getLink, listLinks, redirectToTarget } from "../controllers/linkController";

const router = Router();

router.post("/api/links", createLink);
router.get("/api/links", listLinks);
router.get("/api/links/:code", getLink);
router.delete("/api/links/:code",deleteLink);

router.get("/:code",redirectToTarget);

export default router;