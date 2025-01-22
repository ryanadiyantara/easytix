import express from "express";
import {
  getReservations,
  getCurrentReservations,
  createReservations,
  updateReservations,
  deleteReservations,
} from "../controllers/reservation.controller.js";
// import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

// Verify JWT
// router.use(verifyJWT);

// Routes
router.get("/", getReservations);
router.get("/:id", getCurrentReservations);
router.post("/", createReservations);
router.put("/:id", updateReservations);
router.delete("/:id", deleteReservations);

export default router;
