import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

import { connectDB } from "./config/db.js";

// import authRoutes from "./routes/auth.route.js";
import eventRoutes from "./routes/event.route.js";
import reservationRoutes from "./routes/reservation.route.js";
import ticketRoutes from "./routes/ticket.route.js";
import userRoutes from "./routes/user.route.js";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Resolve __dirname
const __dirname = path.resolve();

// Middleware
// app.use(cookieParser());
app.use(express.json()); //allows us to accept JSON data in the req.body
app.use("/public", express.static(path.join(__dirname, "public")));

// Routes
// app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/user", userRoutes);

// Production settings
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//   });
// }

// Connect to database and start server
app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});
