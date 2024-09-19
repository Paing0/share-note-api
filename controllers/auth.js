import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

import User from "../models/user.js";

// POST /register
export const register = async (req, res) => {
  // Get errors from validationResult which is checked in routes
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errorMessages: errors.array(),
    });
  }

  const { email, password, username } = req.body;
  try {
    // Hash the password using bcrypt with a salt rounds of 10
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password and other details
    const newUser = await User.create({
      email,
      password: hashPassword,
      username,
    });

    // Respond with a 201 status code
    res.status(201).json({ message: "User created.", userId: newUser._id });
  } catch (error) {
    res.status(400).json({
      message: "Failed to register",
      error: error.message,
    });
  }
};

// POST /login
export const login = async (req, res) => {
  // Get errors from validationResult which is checked in routes
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errorMessages: errors.array(),
    });
  }
  const { email, password } = req.body;
  try {
    // Get email from db
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        message: "Email address does not exist",
      });
    }

    // Compare passwords
    const doesPasswordMatch = bcrypt.compareSync(password, user.password);

    // If password does not match
    if (!doesPasswordMatch) {
      return res.status(401).json({
        message: "Please check your email or password again",
      });
    }

    // If both email and password match
    return res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to Login",
      error: error.message,
    });
  }
};
