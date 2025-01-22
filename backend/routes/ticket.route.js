import express from "express";
import {
  getTickets,
  getCurrentTickets,
  createTickets,
  updateTickets,
  deleteTickets,
} from "../controllers/ticket.controller.js";
// import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

// Verify JWT
// router.use(verifyJWT);

// Routes
router.get("/", getTickets);
router.get("/:id", getCurrentTickets);
router.post("/", createTickets);
router.put("/:id", updateTickets);
router.delete("/:id", deleteTickets);

export default router;
