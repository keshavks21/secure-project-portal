import express from "express";
import Project from "../models/Project.js";
import User from "../models/User.js";
import upload from "../middleware/upload.js";
import { verifyToken, isAdmin, isLeadOrAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin: Add new project
router.post("/add", verifyToken, isAdmin, async (req, res) => {
  console.log("HI");
  
  const { name, description, deadline } = req.body;
  const project = new Project({ name, description, deadline });
  await project.save();
  res.status(201).json(project);
});

// Admin: Mark project completed
router.post("/:id/complete", verifyToken, isAdmin, async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
  res.json(project);
});

// routes/projectRoutes.js

router.get("/complete", verifyToken, async (req, res) => {
  try {
    const completedProjects = await Project.find({ completed: true }).populate("assignedDevs", "name email");
    res.json(completedProjects);
  } catch (error) {
    console.error("Error fetching completed projects:", error);
    res.status(500).json({ message: "Server error fetching completed projects" });
  }
});


router.get("/my/projects", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // comes from verifyToken
    const projects = await Project.find({ assignedDevs: userId }).select("name description deadline completed");
    res.json(projects);
  } catch (err) {
    console.error("Error fetching user's projects:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// All: View active projects
router.get("/active", verifyToken, async (req, res) => {
  const projects = await Project.find({ completed: false });
  res.json(projects);
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("assignedDevs", "name email") // only name and email
      .lean();

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ message: "Server error" });
  }
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


router.post("/documents/upload", verifyToken, upload.single("document"), async (req, res) => {
  const { projectId } = req.body;

  if (!req.file || !projectId) {
    return res.status(400).json({ message: "File or Project ID missing." });
  }

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.documents.push({
      filename: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      uploadedAt: new Date(),
    });

    await project.save();

    res.json({
      message: "File uploaded and linked to project",
      document: {
        filename: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
export default router;
