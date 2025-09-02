const mongoose = require("mongoose");

const candidatePlacementSchema = new mongoose.Schema({
  candidateId: { type: String },
  name: { type: String },
  employerName: String,
  jobRole: String,
  salary: Number,
  placementDate: String,
  status: { type: String, enum: ["Placed", "Not Placed"], default: "Not Placed" }
});

const placementSchema = new mongoose.Schema(
  {
    batchId: { type: String }, // 🚫 unique नहीं होना चाहिए
    department: { type: String },
    candidates: [candidatePlacementSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Placement", placementSchema);
