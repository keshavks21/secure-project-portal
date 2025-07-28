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

// Update password for logged-in user
router.put("/update/password", verifyToken, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { password: hashed },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: `Password updated for user ${updatedUser.email || updatedUser.name}`,
      userId: updatedUser._id
    });
  } catch (err) {
    console.error("Error updating password:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


// Admin: Change user role
router.patch("/:id/role", verifyToken, isAdmin, async (req, res) => {
  const { role } = req.body;
  await User.findByIdAndUpdate(req.params.id, { role });
  res.json({ message: "Role updated" });
});

export default router;