import express from "express";
import {
  getUsers,
  getCurrentUsers,
  createUsers,
  updateUsers,
  deleteUsers,
} from "../controllers/user.controller.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

// Routes
router.get("/", verifyJWT, getUsers);
router.get("/:id", verifyJWT, getCurrentUsers);
router.post("/", createUsers);
router.put("/:id", verifyJWT, updateUsers);
router.delete("/:id", verifyJWT, deleteUsers);

export default router;
