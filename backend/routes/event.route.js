import express from "express";
import {
  getEvents,
  getEventById,
  createEvents,
  updateEvents,
  deleteEvents,
} from "../controllers/event.controller.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

// Verify JWT
router.use(verifyJWT);

// Routes
router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", createEvents);
router.put("/:id", updateEvents);
router.delete("/:id", deleteEvents);

export default router;
