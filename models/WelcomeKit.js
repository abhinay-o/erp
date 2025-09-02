const mongoose = require('mongoose');

const candidateStatusSchema = new mongoose.Schema({
  candidateId: { type: String, required: true },
  name: { type: String, required: true },
  kitReceived: { type: Boolean, default: false }
});

const welcomeKitSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true },
    kitIssuedDate: { type: Date, required: true },
    issuedBy: { type: String, required: true },
    trainingCenter: { type: String, required: true },
    itemsDistributed: { type: String },
    remarks: { type: String },
    candidates: [candidateStatusSchema] // ✅ NEW FIELD TO STORE DISTRIBUTION
  },
  { timestamps: true }
);

module.exports = mongoose.model("WelcomeKit", welcomeKitSchema);
