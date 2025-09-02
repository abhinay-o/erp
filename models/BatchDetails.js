// path - backend\models\BatchDetails.js

const mongoose = require("mongoose");
const BatchDetails = require("../models/BatchDetails");
const CertificateDistribution = require("../models/CertificateDistribution");



const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String },
  dob: { type: Date },
  qualification: { type: String},
  contact: { type: String },
  email: { type: String},
}, { _id: false });



const candidateSchema = new mongoose.Schema({
  candidateId: { type: String, required: true },
  name: { type: String },
  gender: { type: String },
  dob: { type: Date },
  contact: { type: String },
  email: { type: String },
  category: { type: String },
}, { _id: false });

const batchDetailsSchema = new mongoose.Schema({
   batchId: { type: String, required: true, unique: true },  
  scheme: { type: String, required: true },
  sanctionOrderNo: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },

  center: {
    centerId: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
  },

  jobRole: {
    name: { type: String, required: true },
    qpCode: { type: String, required: true },
  },
 
   trainers: [trainerSchema],
  candidates: [candidateSchema],

  trainingSchedule: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: Number, required: true }, // In hours
    daysPerWeek: { type: Number, required: true },
    dailyHours: { type: Number, required: true },
    classStartTime: { type: String, required: true },
    classEndTime: { type: String, required: true },
    batchSize: {type: Number, required: true},
    ojtStartDate: {type: Date},
    ojtEndDate: {type: Date},
    // candiateOjtPlaned:{type: String},
    // remainingCandidateOjtPlaned:{type: String},
    // totalOjtDuration:{type: String},
  },

  status: { type: String, default: 'Created' },
  createdAt: { type: Date, default: Date.now },
},
{ timestamps: true ,
  strict: false,
});

module.exports = mongoose.model('BatchDetails', batchDetailsSchema);
