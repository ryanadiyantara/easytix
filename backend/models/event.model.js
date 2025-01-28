import mongoose from "mongoose";

const eventsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    categories: {
      type: String,
      required: true,
    },
    poster_path: {
      type: String,
      required: false,
      default: "-",
    },
    quantity: {
      type: Number,
      required: true,
    },
    available_quantity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    na: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Event = mongoose.model("Event", eventsSchema);

export default Event;
