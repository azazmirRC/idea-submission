const express = require("express");
const multer = require("multer");
const Idea = require("../models/Idea");
const path = require("path");

const router = express.Router();

// File Storage Setup
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ✅ Route to Submit an Idea (With Email)
router.post("/ideas", upload.single("file"), async (req, res) => {
  try {
    const newIdea = new Idea({
      name: req.body.name,
      email: req.body.email, // ✅ Save email in the database
      ideaDesc: req.body.ideaDesc,
      filePath: req.file ? `/uploads/${req.file.filename}` : "",
      status: "Pending",
      priority: "Set Priority"
    });

    await newIdea.save();
    res.status(201).json({ message: "Idea submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Route to Get All Ideas
router.get("/ideas", async (req, res) => {
  try {
    const ideas = await Idea.find();
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Route to Update Idea Status
router.post("/update-idea/:id", async (req, res) => {
  const { status } = req.body;

  try {
    const updatedIdea = await Idea.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedIdea) {
      return res.status(404).json({ error: "Idea not found" });
    }

    res.json(updatedIdea);
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Error updating idea status" });
  }
});

router.post("/update-comment/:id", async (req, res) => {
  try {
    const { comment } = req.body;

    if (comment === undefined) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const updatedIdea = await Idea.findByIdAndUpdate(
      req.params.id,
      { comment },
      { new: true }
    );

    if (!updatedIdea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    res.status(200).json({ message: "Comment updated successfully", updatedIdea });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Server error" });
  }
});





// ✅ Fixed: Route to Update Priority
router.post("/update-priority/:id", async (req, res) => {
  const { priority } = req.body;

  try {
    const updatedIdea = await Idea.findByIdAndUpdate(
      req.params.id,
      { priority },
      { new: true }
    );

    if (!updatedIdea) {
      return res.status(404).json({ error: "Idea not found" });
    }

    res.json(updatedIdea);
  } catch (err) {
    console.error("Error updating priority:", err);
    res.status(500).json({ error: "Error updating idea priority" });
  }
});

router.delete("/delete-idea/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Received DELETE request for ID:", id); // Debugging log
  
      // Ensure ID is a valid MongoDB ObjectId
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("Invalid ObjectId format:", id);
        return res.status(400).json({ error: "Invalid ID format" });
      }
  
      const deletedIdea = await Idea.findByIdAndDelete(id);
  
      if (!deletedIdea) {
        console.log("Idea not found in database.");
        return res.status(404).json({ error: "Idea not found" });
      }
  
      console.log("Idea deleted successfully:", deletedIdea);
      res.status(200).json({ message: "Idea deleted successfully" });
    } catch (err) {
      console.error("Error deleting idea:", err);
      res.status(500).json({ error: "Error deleting idea" });
    }
  });
  
  

module.exports = router;
