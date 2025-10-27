// models/InternalAssessment.js

const mongoose = require('mongoose');

const internalAssessmentSchema = new mongoose.Schema(
  {
    batchId: {
      type: String,
      required: true,
    unique: false
    },
    candidateId: {
      type: String,
      required: true,
     unique: false
    },
    assessmentDate: {
      type: Date,
      required: true
    },
    examName: {
      type: String,
      required: true,
      trim: true
    },
    subjectName: {
      type: String,
      required: true,
      trim: true
    },
    marksObtained: {
      type: Number,
      required: true,
      min: 0
    },
    outOf: {
      type: Number,
      required: true,
      min: 1
    },
    passFail: {
      type: String,
      enum: ['pass', 'fail'],
      default: 'pass'
    },
    remarks: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// ✅ Composite index for better query performance (NON-UNIQUE)
internalAssessmentSchema.index({ batchId: 1, candidateId: 1 });
internalAssessmentSchema.index({ assessmentDate: 1 });

module.exports = mongoose.model('InternalAssessment', internalAssessmentSchema);
