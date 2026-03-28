import mongoose from "mongoose";

const reservationsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    reservation_date: {
      type: Date,
      required: true,
    },
    payment_method: {
      type: String,
      required: false,
    },
    payment_date: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  },
);

const Reservation = mongoose.model("Reservation", reservationsSchema);

export default Reservation;
