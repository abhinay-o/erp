// models/Inspection.js

const mongoose = require('mongoose');

const InspectionSchema = new mongoose.Schema({
  inspectionId: {
    type: String,
    unique: true,
    required: true, // Must be set before saving! (Do in controller)
  },

  inspectorName: {
    type: String,
    required: true,
  },
  inspectorDesignation: {
    type: String,
    required: true,
  },
  inspectorAgency: {
    type: String,
    required: true,
  },
  inspectionDate: {
    type: Date,
    required: true,
  },
  inspectionType: {
    type: String,
    enum: ['Routine', 'Surprise', 'Follow-up'],
    required: true,
  },
  inspectionMode: {
    type: String,
    enum: ['Offline', 'Online'],
    default: 'Offline',
  },

  centerId: {
    type: String,
    required: true,
  },
  batchId: {
    type: String,
  },

  // Center Infrastructure
  centerOperational: Boolean,
  fireExtinguisherAvailable: Boolean,
  safeDrinkingWaterAvailable: Boolean,
  toiletsWorking: Boolean,
  powerBackupAvailable: Boolean,
  ventilationStatus: {
    type: String,
    enum: ['Good', 'Average', 'Poor'],
  },
  biometricFunctional: Boolean,
  cctvInstalled: Boolean,
  internetAvailable: Boolean,
  cleanlinessLevel: {
    type: String,
    enum: ['Excellent', 'Good', 'Needs Improvement'],
  },
  structurallySound: Boolean,
  documentsDisplayed: Boolean,

  // Trainer Info
  trainerPresent: Boolean,
  trainerName: String,
  isTOTCertified: Boolean,
  totCertificateNo: String,
  totAgency: String,
  trainerRemarks: String,

  // Batch / Candidate Verification
  batchOngoing: Boolean,
  candidateCountPresent: Number,
  candidateAttendanceVerified: Boolean,
  classInProgress: Boolean,
  blackboardUsed: Boolean,
  projectorUsed: Boolean,
  candidateFeedback: String,

  // Hostel Info
  residentialFacilityAvailable: Boolean,
  hostelCleanliness: {
    type: String,
    enum: ['Good', 'Average', 'Poor'],
  },
  maleBedsCount: Number,
  femaleBedsCount: Number,
  hostelSecurityAvailable: Boolean,
  fireExitAvailable: Boolean,
  washroomsFunctional: Boolean,

  // Document / Records
  studentFilesAvailable: Boolean,
  centerRegisterMaintained: Boolean,
  biometricLogsMaintained: Boolean,
  equipmentRegisterMaintained: Boolean,
  photosCaptured: [String],      // URLs or base64
  documentsUploaded: [String],   // URLs or filenames

  // Summary
  inspectionRemarks: String,
  complianceStatus: {
    type: String,
    enum: ['Compliant', 'Partially Compliant', 'Non-Compliant'],
    required: true,
  },
  issuesFound: [String],
  correctiveActionsSuggested: String,
  followUpRequired: Boolean,
  nextVisitDue: Date,

  // Audit
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  submittedOn: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'Reviewed', 'Flagged'],
    default: 'Draft',
  },
  reviewerRemarks: String,
  score: Number,
});

// Export
module.exports = mongoose.model('Inspection', InspectionSchema);