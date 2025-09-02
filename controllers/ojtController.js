// path- C:\Users\saxen\OneDrive\Documents\ERP-Project\backend\controllers\ojtController.js

const BatchDetails = require("../models/BatchDetails");
const OjtDetails = require("../models/OjtDetails");

exports.createOjt = async (req, res) => {
  try {
    if (!req.body || !req.body.batchId) {
      return res.status(400).json({ error: "batchId is required" });
    }

    const {
      batchId,
      ojtEmployerName,
      ojtLocation,
      ojtJobRole,
      ojtStartDate,
      ojtEndDate,
      supervisorName,
      contactNo,
      candidateRequired,
      natureOfOjt,
      workingHours,
      status,
      remarks,
    } = req.body;

    // Find batch by its custom batchId string
    const batch = await BatchDetails.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({ error: "Batch not found" });
    }

    // Create new OjtDetails
    const newOjt = new OjtDetails({
      batchId: batch._id,
      batchCode: batch.batchId, // e.g. "BATCH-2025-001"
      batchInfo: {
        jobRole: batch.jobRole,
        state: batch.state,
        district: batch.district,
        batchSize: batch.batchSize,
        ojtStartDate: batch.ojtStartDate,
        ojtEndDate: batch.ojtEndDate,
      },
      ojtEmployerName,
      ojtLocation,
      ojtJobRole,
      ojtStartDate,
      ojtEndDate,
      supervisorName,
      contactNo,
      candidateRequired,
      natureOfOjt,
      workingHours,
      status,
      remarks,
    });

    await newOjt.save();
    res.status(201).json(newOjt);
  } catch (err) {
    console.error("❌ Error saving OJT:", err);
    res.status(400).json({ error: err.message || "Failed to create OJT" });
  }
};

exports.getAllOjts = async (req, res) => {
  try {
    const ojts = await OjtDetails.find();
    res.status(200).json(ojts);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch OJTs" });
  }
};

exports.getOjtById = async (req, res) => {
  try {
    const { id } = req.params;

    const ojt = await Ojt.findById(id)
      .populate("batchId", "batchName") // sirf batchName lena hai
      .populate("candidateId", "candidateName candidateID") // candidate ka naam & ID
      .populate("employerId", "employerName"); // employer ka naam

    if (!ojt) {
      return res.status(404).json({ message: "OJT not found" });
    }

    res.json(ojt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateOjtStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Allowed statuses - सुनिश्चित करें ये schema के enum से मैच करें
    const allowed = ["Planned", "Ongoing", "Completed", "Approved", "Rejected", "Confirmed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await OjtDetails.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "OJT record not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating OJT status:", err);
    res.status(500).json({ error: err.message || "Server error while updating status" });
  }
};

exports.deleteOjt = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await OjtDetails.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "OJT record not found" });
    res.status(200).json({ message: "OJT record deleted successfully" });
  } catch (error) {
    console.error("Error deleting OJT record:", error);
    res.status(500).json({ error: error.message || "Server error while deleting" });
  }
};


// controllers/ojtController.js

exports.updateOjt = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Agar file upload hai to uska handling bhi karein:
    if (req.file) {
      // Save file logic according to your storage strategy
      // For example, upload to cloud or save path
      updateData.ojtCompletionCertificate = "path/to/saved/file.pdf"; // Just example
    }

    const updatedOjt = await OjtDetails.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedOjt) {
      return res.status(404).json({ error: "OJT record not found" });
    }

    res.status(200).json(updatedOjt);
  } catch (err) {
    console.error("Error updating OJT:", err);
    res.status(500).json({ error: err.message || "Failed to update OJT" });
  }
};
