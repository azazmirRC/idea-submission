const mongoose = require("mongoose");

const IdeaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }, // ✅ Ensure email is stored
  ideaDesc: { type: String, required: true },
  filePath: { type: String },
  status: { type: String, default: "Pending" },
  priority: { type: String, default: "Set Priority" },
  comment: { type: String, default: "" },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Idea", IdeaSchema);
