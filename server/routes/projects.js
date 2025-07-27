import express from "express";
import Project from "../models/Project.js";
import User from "../models/User.js";
import { verifyToken, isAdmin, isLeadOrAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin: Add new project
router.post("/add", verifyToken, isAdmin, async (req, res) => {
  const { name, description, deadline } = req.body;
  const project = new Project({ name, description, deadline });
  await project.save();
  res.status(201).json(project);
});

// Admin: Mark project completed
router.patch("/:id/complete", verifyToken, isAdmin, async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
  res.json(project);
});

// All: View active projects
router.get("/active", verifyToken, async (req, res) => {
  const projects = await Project.find({ completed: false });
  res.json(projects);
});

// Lead: Assign developer
router.post("/:id/assign", verifyToken, isLeadOrAdmin, async (req, res) => {
  const { developerId } = req.body;
  const project = await Project.findById(req.params.id);
  const dev = await User.findById(developerId);
  if (!project || !dev) return res.status(404).json({ message: "Invalid data" });
  project.assignedDevs.push(dev._id);
  dev.assignedProjects.push(project._id);
  await project.save();
  await dev.save();
  res.json({ message: "Developer assigned" });
});

export default router;
