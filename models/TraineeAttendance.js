
// models/TraineeAttendance.js
const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema(
  {
    traineeId: { type: String, required: true },
    traineeName: { type: String, required: true },
    present: { type: Boolean, default: false },
  },
  { _id: false }
);

const traineeAttendanceSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true, index: true },
    date: { type: String, required: true }, // ISO yyyy-mm-dd
    classTiming: { type: String }, // e.g., "10:00 - 12:00"
    records: { type: [attendanceRecordSchema], default: [] },
    // optional audit
    createdBy: { type: String },
  },
  { timestamps: true }
);

// Prevent duplicate batch+date sessions
traineeAttendanceSchema.index({ batchId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("TraineeAttendance", traineeAttendanceSchema);
