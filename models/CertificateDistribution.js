
// backend/models/CertificateDistribution.js
const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true },          // expect BatchDetails._id as string
    batchCode: { type: String },                        // human-readable batchId code from BatchDetails.batchId
    centerId: { type: String },                         // center.centerId
    centerName: { type: String },
    certificateName: { type: String, required: true },  // new: certificate name/title
    jobRole: { type: String },                          // job role/trade
    batchSize: { type: Number },                        // planned size
    batchEnrolled: { type: Number },                    // actual enrolled (optional)
    candidateId: { type: String, required: true },
    candidateName: { type: String, required: true },
    distributionMode: { type: String, enum: ["By Hand", "By Courier"], default: "By Hand" },
    distributionDate: { type: String, required: true }, // YYYY-MM-DD
  },
  { timestamps: true }
);

module.exports = mongoose.model("CertificateDistribution", certificateSchema);
