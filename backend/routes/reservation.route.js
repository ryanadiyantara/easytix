import express from "express";
import {
  getReservations,
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
router.post("/", createReservations);
router.put("/:id", updateReservations);
router.delete("/:id", deleteReservations);

export default router;
