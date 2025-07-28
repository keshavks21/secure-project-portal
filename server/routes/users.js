import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/developers", verifyToken, async (req, res) => {
  try {
    const developers = await User.find({ role: "Developer" }).select("-password");
    res.json(developers);
  } catch (err) {
    console.error("Error fetching developers:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// View all users (admin)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Update password
router.put("/password", verifyToken, async (req, res) => {
  const { password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await User.findByIdAndUpdate(req.user.id, { password: hashed });
  res.json({ message: "Password updated" });
});

// Admin: Change user role
router.patch("/:id/role", verifyToken, isAdmin, async (req, res) => {
  const { role } = req.body;
  await User.findByIdAndUpdate(req.params.id, { role });
  res.json({ message: "Role updated" });
});

export default router;