import mongoose from "mongoose";
import Reservation from "../models/reservation.model.js";

// Controller to create a new reservation
export const createReservations = async (req, res) => {
  const reservation = req.body; // user will send this data
  reservation.status = "Booked";

  try {
    // Save new reservation to database
    const newReservation = new Reservation(reservation);
    await newReservation.save();

    // Populate user and event details
    const populatedReservation = await Reservation.findById(newReservation._id)
      .populate("user_id") // Populate data user
      .populate("event_id"); // Populate data event

    res.status(201).json({ success: true, data: populatedReservation });
  } catch (error) {
    console.error("Error in Create reservation:", error, message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Controller to get all reservations
export const getReservations = async (req, res) => {
  try {
    // Fetch all reservations
    const reservations = await Reservation.find({})
      .populate("user_id") // Populate data user
      .populate("event_id"); // Populate data event

    res.status(200).json({ success: true, data: reservations });
  } catch (error) {
    console.log("Error in Fetching reservations:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

// Controller to update a reservation by ID
export const updateReservations = async (req, res) => {
  const { id } = req.params;
  const reservation = req.body; // user will send this data

  // Validate the reservation ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Reservation Id" });
  }

  try {
    // Update the reservation by ID
    const updatedReservation = await Reservation.findByIdAndUpdate(id, reservation, {
      new: true,
    })
      .populate("user_id") // Populate data user
      .populate("event_id"); // Populate data event

    res.status(200).json({ success: true, data: updatedReservation });
  } catch (error) {
    console.log("Error in Updating reservations:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Controller to delete a reservation by ID
export const deleteReservations = async (req, res) => {
  const { id } = req.params;

  // Validate the reservation ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Reservation Id" });
  }

  try {
    // Delete the reservation by ID
    await Reservation.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Reservation deleted" });
  } catch (error) {
    console.log("Error in Deleting Reservations:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
