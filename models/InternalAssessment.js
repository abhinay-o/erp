const mongoose = require("mongoose");

const candidateAssessmentSchema = new mongoose.Schema({
  candidateId: { type: String, required: true },
  name: { type: String }, // optional but recommended for views
  assessmentDate: { type: Date, required: true },
  trainerName: { type: String, required: true },
  marksObtained: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  remarks: { type: String }
}, { _id: false });

const internalAssessmentSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true, index: true, unique: true },
    assessments: { type: [candidateAssessmentSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('InternalAssessment', internalAssessmentSchema);
