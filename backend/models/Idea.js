const mongoose = require("mongoose");

const IdeaSchema = new mongoose.Schema({
  name: String,
  employeeId: String,
  ideaDesc: String,
  filePath: String,
  status: { type: String, default: "Pending" },
  priority: { type: String, default: "Set Priority" } 
});

module.exports = mongoose.model("Idea", IdeaSchema);
