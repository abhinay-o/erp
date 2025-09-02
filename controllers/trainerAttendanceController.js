
// backend/controllers/trainerAttendanceController.js
const mongoose = require("mongoose");
const TrainerAttendance = require("../models/TrainerAttendance");
const BatchDetails = require("../models/BatchDetails");

const isISODate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);

// GET trainers for a batch to render the form
exports.getBatchTrainers = async (req, res) => {
  try {
    const { batchId } = req.params; // expects BatchDetails._id
    if (!mongoose.Types.ObjectId.isValid(batchId)) {
      return res.status(400).json({ error: "Invalid batchId format" });
    }
    const batch = await BatchDetails.findById(batchId).lean();
    if (!batch) return res.status(404).json({ error: "Batch not found" });

    const list = Array.isArray(batch.trainers) ? batch.trainers : [];
    if (list.length === 0) {
      return res.status(404).json({ error: "No trainers for this batch" });
    }

    const trainers = list.map((t, idx) => ({
      trainerId: t.email || t.contact || String(idx + 1), // fallback if no explicit ID
      trainerName: t.name || "",
    }));

    const defaultClassTiming = `${batch.trainingSchedule?.classStartTime || ""} - ${batch.trainingSchedule?.classEndTime || ""}`.trim();

    return res.json({
      batchId: batch._id,
      batchCode: batch.batchId,
      trainers,
      defaultClassTiming,
    });
  } catch (err) {
    console.error("getBatchTrainers error:", err);
    return res.status(500).json({ error: "Failed to load trainers" });
  }
};

// POST create attendance
exports.createTrainerAttendance = async (req, res) => {
  try {
    const { batchId, date, classTiming, records } = req.body;

    if (!batchId) return res.status(400).json({ error: "batchId is required" });
    if (!date || !isISODate(date)) return res.status(400).json({ error: "date must be YYYY-MM-DD" });
    if (!Array.isArray(records) || records.length === 0)
      return res.status(400).json({ error: "records array is required" });

    const normalized = records.map((r) => ({
      trainerId: String(r.trainerId || "").trim(),
      trainerName: String(r.trainerName || "").trim(),
      present: !!r.present,
    }));
    if (normalized.some((r) => !r.trainerId || !r.trainerName)) {
      return res.status(400).json({ error: "trainerId and trainerName are required in each record" });
    }

    const exists = await TrainerAttendance.findOne({ batchId, date }).lean();
    if (exists) {
      return res.status(409).json({ error: "Attendance for this batch and date already exists" });
    }

    const doc = new TrainerAttendance({
      batchId,
      date,
      classTiming: classTiming || "",
      records: normalized,
      createdBy: req.user?.id || req.user?._id || null,
    });
    await doc.save();
    return res.status(201).json(doc);
  } catch (error) {
    console.error("Error saving attendance:", error);
    if (error?.code === 11000) {
      return res.status(409).json({ error: "Attendance for this batch and date already exists" });
    }
    return res.status(500).json({ error: "Failed to save attendance" });
  }
};

// GET attendance by batch, optional date filter
exports.getTrainerAttendanceByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { date } = req.query;
    const query = { batchId };
    if (date) query.date = date;

    const records = await TrainerAttendance.find(query).sort({ date: -1 }).lean();
    return res.json(records);
  } catch (error) {
    console.error("Failed to fetch records:", error);
    return res.status(500).json({ error: "Failed to fetch records" });
  }
};
