// controllers/traineeAttendanceController.js
const mongoose = require("mongoose");
const TraineeAttendance = require("../models/TraineeAttendance");
const BatchDetails = require("../models/BatchDetails");

const isISODate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);

exports.getBatchCandidates = async (req, res) => {
  try {
    const { batchId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(batchId)) {
      return res.status(400).json({ error: "Invalid batchId format" });
    }
    const batch = await BatchDetails.findById(batchId).lean();
    if (!batch) return res.status(404).json({ error: "Batch not found" });

    const list = Array.isArray(batch.candidates) ? batch.candidates : [];
    if (list.length === 0) {
      return res.status(404).json({ error: "No candidates for this batch" });
    }

    const candidates = list.map((c) => ({
      traineeId: c.candidateId || "",
      traineeName: c.name || "",
    }));

    return res.json({
      batchId: batch._id,
      batchCode: batch.batchId,
      candidates,
      defaultClassTiming: `${batch.trainingSchedule?.classStartTime || ""} - ${batch.trainingSchedule?.classEndTime || ""}`.trim(),
    });
  } catch (err) {
    console.error("getBatchCandidates error:", err);
    return res.status(500).json({ error: "Failed to load candidates" });
  }
};

exports.createTraineeAttendance = async (req, res) => {
  try {
    const { batchId, date, classTiming, records } = req.body;

    if (!batchId) return res.status(400).json({ error: "batchId is required" });
    if (!date || !isISODate(date))
      return res.status(400).json({ error: "date (YYYY-MM-DD) is required" });
    if (!Array.isArray(records) || records.length === 0)
      return res.status(400).json({ error: "records array is required" });

    // Normalize and validate records
    const normalized = records.map((r) => ({
      traineeId: String(r.traineeId || "").trim(),
      traineeName: String(r.traineeName || "").trim(),
      present: Boolean(r.present),
    }));
    if (normalized.some((r) => !r.traineeId || !r.traineeName)) {
      return res
        .status(400)
        .json({ error: "traineeId and traineeName are required in each record" });
    }

    // Prevent duplicate session for same batch+date
    const exists = await TraineeAttendance.findOne({ batchId, date }).lean();
    if (exists) {
      return res
        .status(409)
        .json({ error: "Attendance for this batch and date already exists" });
    }

    const attendance = new TraineeAttendance({
      batchId,
      date,
      classTiming: classTiming || "",
      records: normalized,
      createdBy: req.user?.id || req.user?._id || null,
    });
    await attendance.save();
    return res.status(201).json(attendance);
  } catch (error) {
    console.error("Error saving trainee attendance:", error);
    // Handle duplicate key error from unique index
    if (error?.code === 11000) {
      return res
        .status(409)
        .json({ error: "Attendance for this batch and date already exists" });
    }
    return res.status(500).json({ error: "Failed to save trainee attendance" });
  }
};

exports.getTraineeAttendanceByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { date } = req.query; // optional filter
    const query = { batchId };
    if (date) query.date = date;
    const records = await TraineeAttendance.find(query).sort({ date: -1 }).lean();
    return res.json(records);
  } catch (error) {
    console.error("Fetch attendance error:", error);
    return res.status(500).json({ error: "Failed to fetch trainee attendance records" });
  }
};
