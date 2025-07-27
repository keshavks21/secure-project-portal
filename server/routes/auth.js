import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin-only: Register new user
router.post("/register", async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();

    if (userCount > 0) {
      // For existing users, require Admin token
      return verifyToken(req, res, () => isAdmin(req, res, next));
    }

    // First user: allow without token (public registration)
    next();
  } catch (err) {
    return res.status(500).json({ error: "Server error in registration gate" });
  }
}, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Optional: prevent non-admin roles from being created in first run
    if (!role && (await User.countDocuments()) === 0) {
      return res.status(400).json({ message: "Role required for first user" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
