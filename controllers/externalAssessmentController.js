// const ExternalAssessment = require('../models/ExternalAssessment'); // ✅ Correct import

// // ✅ GET all assessments
// exports.getAllAssessments = async (req, res) => {
//   try {
//     const data = await ExternalAssessment.find();
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch assessments' });
//   }
// };




// exports.createAssessment = async (req, res) => {

// console.log("req.body in controller:", req.body);


//   try {
//     console.log("Received data from frontend:", req.body); // 🧠 Debug check

//     const newAssessment = new ExternalAssessment({
//       candidateId: req.body.candidateId,
//       assessmentDate: req.body.assessmentDate,
//       assessorName: req.body.assessorName,
//       result: req.body.result,
//       remarks: req.body.remarks,
//       document: req.body.document,
//       batchId: req.body.batchId // ✅ Make sure this is coming!
//     });

//     await newAssessment.save();
//     res.status(201).json(newAssessment);
//   } catch (error) {
//     console.error("Error saving assessment:", error);
//     res.status(500).json({ error: "Failed to save assessment" });
//   }
// };





const ExternalAssessmentSchema = require("../models/ExternalAssessment");

// Create or replace the entire assessments array for a batch (idempotent upsert)
exports.upsertBatch = async (req, res) => {
  try {
    const { batchId, assessments } = req.body;

    if (!batchId || !Array.isArray(assessments)) {
      return res.status(400).json({ error: "batchId and assessments (array) are required" });
    }

    const doc = await ExternalAssessmentSchema.findOneAndUpdate(
      { batchId },
      { $set: { assessments } },
      { upsert: true, new: true }
    );

    return res.status(200).json(doc);
  } catch (err) {
    console.error("upsertBatch error:", err);
    return res.status(500).json({ error: "Failed to save batch assessments" });
  }
};

// Append/merge additional candidate assessments to an existing batch (non-destructive)
exports.appendAssessments = async (req, res) => {
  try {
    const { batchId, assessments } = req.body;

    if (!batchId || !Array.isArray(assessments)) {
      return res.status(400).json({ error: "batchId and assessments (array) are required" });
    }

    const doc = await ExternalAssessmentSchema.findOneAndUpdate(
      { batchId },
      { $push: { assessments: { $each: assessments } } },
      { upsert: true, new: true }
    );

    return res.status(200).json(doc);
  } catch (err) {
    console.error("appendAssessments error:", err);
    return res.status(500).json({ error: "Failed to append assessments" });
  }
};

// Get one batch’s assessments (single document)
exports.getByBatchId = async (req, res) => {
  try {
    const { batchId } = req.params;
    const doc = await ExternalAssessmentSchema.findOne({ batchId });
    if (!doc) return res.status(404).json({ error: "Batch not found" });
    return res.json(doc);
  } catch (err) {
    console.error("getByBatchId error:", err);
    return res.status(500).json({ error: "Failed to fetch batch assessments" });
  }
};

// Update a specific candidate’s assessment by candidateId within the batch
exports.updateCandidateInBatch = async (req, res) => {
  try {
    const { batchId, candidateId } = req.params;
    const updates = req.body; // { name?, assessmentDate?, trainerName?, marksObtained?, totalMarks?, remarks? }

    // Build positional $set for only provided fields
    const setObj = {};
    for (const [key, value] of Object.entries(updates)) {
      setObj[`assessments.$.${key}`] = value;
    }

    if (Object.keys(setObj).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const doc = await ExternalAssessmentSchema.findOneAndUpdate(
      { batchId, "assessments.candidateId": candidateId },
      { $set: setObj },
      { new: true }
    );

    if (!doc) return res.status(404).json({ error: "Candidate or batch not found" });
    return res.json(doc);
  } catch (err) {
    console.error("updateCandidateInBatch error:", err);
    return res.status(500).json({ error: "Failed to update candidate assessment" });
  }
};

// Remove a specific candidate’s assessment from a batch
exports.removeCandidateFromBatch = async (req, res) => {
  try {
    const { batchId, candidateId } = req.params;

    const doc = await ExternalAssessmentSchema.findOneAndUpdate(
      { batchId },
      { $pull: { assessments: { candidateId } } },
      { new: true }
    );

    if (!doc) return res.status(404).json({ error: "Batch not found" });
    return res.json(doc);
  } catch (err) {
    console.error("removeCandidateFromBatch error:", err);
    return res.status(500).json({ error: "Failed to remove candidate assessment" });
  }
};

// Optional: list all batch documents (useful for admin)
exports.listAllBatches = async (req, res) => {
  try {
    const docs = await ExternalAssessmentSchema.find().sort({ updatedAt: -1 });
    return res.json(docs);
  } catch (err) {
    console.error("listAllBatches error:", err);
    return res.status(500).json({ error: "Failed to fetch assessments" });
  }
};

// Optional: delete a batch’s assessment document completely
exports.deleteByBatchId = async (req, res) => {
  try {
    const { batchId } = req.params;
    const result = await ExternalAssessmentSchema.findOneAndDelete({ batchId });
    if (!result) return res.status(404).json({ error: "Batch not found" });
    return res.json({ message: "Batch assessment deleted" });
  } catch (err) {
    console.error("deleteByBatchId error:", err);
    return res.status(500).json({ error: "Failed to delete batch assessment" });
  }
};
