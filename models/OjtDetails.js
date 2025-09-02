// models/OjtDetails.js
const mongoose = require("mongoose");

const ojtSchema = new mongoose.Schema({
  // Reference fields
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BatchDetails",
    required: true,
  },

   batchCode: {
    type: String,
    required: true,
    unique: true
  },
  batchInfo: {
    jobRole: {
      name: String,
      code: String,
    },
    state: String,
    district: String,
    batchSize: Number,
    ojtStartDate: Date,
    ojtEndDate: Date,
  },
  
  // candidateId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Candidate",
  //   required: true,
  // },

  // OJT core details

  ojtEmployerName: { type: String, required: true },
  ojtLocation: { type: String, required: true },
  ojtJobRole: { type: String, required: true },
  // ojtStartDate: { type: Date, required: true },
  // ojtEndDate: { type: Date, required: true },
  supervisorName:{type: String, required: true},
  contactNo:{type : Number, required: true},
  candidateRequired:{type : String, required: true},
  natureOfOjt:{type: String, required: true},
  workingHours: { type: Number, required: true },
  // stipendPaid: { type: String },  e.g., "Yes", "No", or amount if needed
  // feedbackFromEmployer: { type: String },

  // File upload
 // ojtCompletionCertificate: { type: String }, // File path or URL

  // Status tracking
  status: {
    type: String,
    enum: ["Planned", "Ongoing", "Completed", "Approved", "Rejected"],
    default: "Planned",
  },
  remarks: { type: String },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("OjtDetails", ojtSchema);
