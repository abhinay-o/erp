
// backend/controllers/certificateDistributionController.js
const mongoose = require("mongoose");
const CertificateDistribution = require("../models/CertificateDistribution");
const BatchDetails = require("../models/BatchDetails");

// GET candidates + batch meta for form rendering
exports.getBatchCertificateMeta = async (req, res) => {
  try {
    const { batchId } = req.params; // expects BatchDetails._id
    if (!mongoose.Types.ObjectId.isValid(batchId)) {
      return res.status(400).json({ error: "Invalid batchId format" });
    }
    const batch = await BatchDetails.findById(batchId).lean();
    if (!batch) return res.status(404).json({ error: "Batch not found" });

    const candidates = Array.isArray(batch.candidates)
      ? batch.candidates.map((c) => ({
          candidateId: c.candidateId || "",
          candidateName: c.name || "",
        }))
      : [];

    return res.json({
      batchId: String(batch._id),
      batchCode: batch.batchId || "",
      centerId: batch.center?.centerId || "",
      centerName: batch.center?.name || "",
      jobRole: batch.jobRole?.name || "",
      batchSize: batch.trainingSchedule?.batchSize || (batch.candidates?.length || 0),
      candidates,
    });
  } catch (err) {
    console.error("getBatchCertificateMeta error:", err);
    return res.status(500).json({ error: "Failed to load batch certificate meta" });
  }
};

exports.createDistribution = async (req, res) => {
  try {
    const cert = new CertificateDistribution(req.body);
    await cert.save();
    res.status(201).json(cert);
  } catch (error) {
    console.error("Error saving certificate:", error);
    res.status(500).json({ error: "Failed to save certificate distribution" });
  }
};

exports.getByBatchId = async (req, res) => {
  try {
    const { batchId } = req.params;
    const records = await CertificateDistribution.find({ batchId: batchId }).sort({ createdAt: -1 }).lean();
    res.json(records);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to get certificate data" });
  }
};

exports.deleteDistribution = async (req, res) => {
  try {
    const { id } = req.params;
    await CertificateDistribution.findByIdAndDelete(id);
    res.json({ message: "Certificate record deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting record:", err);
    res.status(500).json({ error: "Failed to delete certificate record" });
  }
};
