// backend/models/Dropout.js
const mongoose = require('mongoose');

const dropoutSchema = new mongoose.Schema({
  batchId: { type: String, required: true, index: true },
  candidateId: { type: String, required: true, index: true },
  candidateName: { type: String }, // convenience
  dropoutDate: { type: Date, required: true },
  reason: { type: String },
  remarks: { type: String },
  createdBy: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Dropout', dropoutSchema);
