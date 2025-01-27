import express from "express";
import {
  signin,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import signinLimiter from "../middleware/signinLimiter.js";

const router = express.Router();

router.post("/", signinLimiter, signin);
router.get("/refresh", refresh);
router.post("/logout", logout);
router.post("/forgotpassword", forgotPassword);
router.get("/resetpassword", resetPassword);

export default router;
