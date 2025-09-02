
// backend/models/TrainerAttendance.js
const mongoose = require("mongoose");

const trainerAttendanceRecordSchema = new mongoose.Schema(
  {
    trainerId: { type: String, required: true },
    trainerName: { type: String, required: true },
    present: { type: Boolean, default: false },
  },
  { _id: false }
);

const trainerAttendanceSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true, index: true }, // store BatchDetails._id as string for consistency with existing code
    date: { type: String, required: true }, // YYYY-MM-DD
    classTiming: { type: String }, // "HH:mm - HH:mm"
    records: { type: [trainerAttendanceRecordSchema], default: [] },
    createdBy: { type: String },
  },
  { timestamps: true }
);

// Prevent duplicate attendance for same batch+date
trainerAttendanceSchema.index({ batchId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("TrainerAttendance", trainerAttendanceSchema);
