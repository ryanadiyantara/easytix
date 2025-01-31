import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import fs from "fs";
import User from "../models/user.model.js";
import Counter from "../models/counter.model.js";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/user_profile_picture");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Initialize multer upload
const upload = multer({ storage }).single("file");

// Function to get the next user ID
const getNextUserId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "user_id" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

// Controller to create a new user
export const createUsers = async (req, res) => {
  const user = req.body; // user will send this data

  // Validate required fields
  if (!user.name || !user.email || !user.user_password) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  // Check if email already exists
  const existingEmail = await User.findOne({ email: user.email });

  if (existingEmail) {
    return res.status(400).json({ success: false, message: "Email is already taken" });
  }

  try {
    // Add next user ID
    user.user_id = await getNextUserId();

    // Add hashed password
    const hashedPwd = await bcrypt.hash(user.user_password, 10); // salt rounds
    user.user_password = hashedPwd;

    // Save new user to database
    const newUser = new User(user);
    await newUser.save();

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error("Error in Create user:", error, message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Controller to get all users
export const getUsers = async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find({});

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.log("Error in Fetching users:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

// Controller to get the current user by ID
export const getCurrentUsers = async (req, res) => {
  const { id } = req.params;

  // Validate the user ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid User ID" });
  }

  try {
    // Fetch the user by ID
    const user = await User.findById(id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log("Error in Fetching users:", error.message);
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

// Controller to update a user by ID
export const updateUsers = async (req, res) => {
  upload(req, res, async (err) => {
    // Check for file upload error
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "File upload failed", error: err.message });
    }

    const { id } = req.params;
    const user = req.body; // user will send this data

    // Validate the user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Invalid User Id" });
    }

    // Check if user exists
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if email is being changed
    if (user.email && user.email !== existingUser.email) {
      const emailExists = await User.findOne({ email: user.email });

      if (emailExists) {
        if (req.file) {
          fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Failed to delete file:", unlinkErr);
            }
          });
        }
        return res.status(400).json({ success: false, message: "Email is already taken" });
      }
    }

    // Check if a new file is uploaded
    if (req.file) {
      const filePath = path.relative("public/uploads", req.file.path);
      user.profile_picture_path = filePath;
    }

    // Check if password needs to be updated
    if (user.old_password && user.new_password) {
      // Check if the user exists
      const foundUser = await User.findOne({ email: user.currentEmail }).exec();

      if (!foundUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // Compare the old password
      const match = await bcrypt.compare(user.old_password, foundUser.user_password);

      if (match) {
        // Remove unnecessary fields
        delete user.old_password;
        delete user.currentEmail;

        // Hash the new password
        const hashedPwd = await bcrypt.hash(user.new_password, 10); // salt rounds
        user.user_password = hashedPwd;

        // Remove new password field
        delete user.new_password;
      } else {
        return res.status(404).json({ success: false, message: "Wrong Old Password" });
      }
    }

    try {
      // Update the user by ID
      const updatedUser = await User.findByIdAndUpdate(id, user, {
        new: true,
      });

      res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      console.log("Error in Updating users:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
};

// Controller to delete a user by ID
export const deleteUsers = async (req, res) => {
  const { id } = req.params;

  // Validate the user ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid User Id" });
  }

  try {
    // Delete the user by ID
    await User.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    console.log("Error in Deleting users:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
