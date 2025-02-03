import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import Event from "../models/event.model.js";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/event_poster_picture");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Initialize multer upload
const upload = multer({ storage }).single("file");

// Controller to create a new event
export const createEvents = async (req, res) => {
  upload(req, res, async (err) => {
    // Check for file upload error
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "File upload failed", error: err.message });
    }

    const event = req.body; // user will send this data

    // Validate required fields
    if (
      !event.name ||
      !event.start_date ||
      !event.end_date ||
      !event.venue ||
      !event.description ||
      !event.quantity
    ) {
      return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    // Check if event name already exists
    const existingEventName = await Event.findOne({ name: event.name });

    if (existingEventName) {
      return res.status(400).json({ success: false, message: "Event name is already exist" });
    }

    if (req.file) {
      const filePath = path.relative("public/uploads", req.file.path);
      event.poster_path = filePath;
    }

    event.available_quantity = event.quantity;
    event.status = "Ready";

    try {
      // Save new event to database
      const newEvent = new Event(event);
      await newEvent.save();

      res.status(201).json({ success: true, data: newEvent });
    } catch (error) {
      console.error("Error in Create event:", error);

      // Delete file if event creation fails
      if (req.file) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to delete file during error handling:", unlinkErr);
          }
        });
      }
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
};

// Controller to get all events
export const getEvents = async (req, res) => {
  try {
    // Fetch all events
    const events = await Event.find({});

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.log("Error in Fetching events:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

// Controller to get event by ID
export const getEventById = async (req, res) => {
  const { id } = req.params;

  // Validate the event ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Event ID" });
  }

  try {
    // Fetch the event by ID
    const event = await Event.findById(id);
    // Check if event exists
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.log("Error in Fetching events:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

// Controller to update a event by ID
export const updateEvents = async (req, res) => {
  upload(req, res, async (err) => {
    // Check for file upload error
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "File upload failed", error: err.message });
    }

    const { id } = req.params;
    const event = req.body; // user will send this data

    // Validate the event ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Invalid Event Id" });
    }

    // Check if event exists
    const existingEvent = await Event.findById(id);

    // Check if email is being changed
    if (event.name && event.name !== existingEvent.name) {
      const nameExists = await Event.findOne({ name: event.name });

      if (nameExists) {
        if (req.file) {
          fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Failed to delete file:", unlinkErr);
            }
          });
        }
        return res.status(400).json({ success: false, message: "Name is already taken" });
      }
    }

    // Check if a new file is uploaded
    if (req.file) {
      const filePath = path.relative("public/uploads", req.file.path);
      event.poster_path = filePath;
    }

    try {
      // Update the event by ID
      const updatedEvent = await Event.findByIdAndUpdate(id, event, {
        new: true,
      });

      res.status(200).json({ success: true, data: updatedEvent });
    } catch (error) {
      console.log("Error in Updating events:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
};

// Controller to delete a event by ID
export const deleteEvents = async (req, res) => {
  const { id } = req.params;

  // Validate the event ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Event Id" });
  }

  try {
    // Delete the event by ID
    await Event.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    console.log("Error in Deleting events:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
