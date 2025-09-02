// path - backend\controllers\batchDetailsController.js

const generateNextBatchId = require('../utils/generateBatchId');
const BatchDetails = require('../models/BatchDetails');

// Create batch with auto batchId
exports.createBatchDetails = async (req, res) => {
  try {
   // console.log("📥 Incoming batch request body:", req.body); // Debug input
    const nextBatchId = await generateNextBatchId();
    console.log("🆕 Generated Batch ID:", nextBatchId); // Debug ID

    const batch = new BatchDetails({
      ...req.body,
      batchId: nextBatchId
    });

    await batch.save();
    console.log("✅ Batch saved successfully");
    res.status(201).json(batch);
  } catch (err) {
    console.error("❌ Error creating batch:", err);
    res.status(500).json({ message: "Failed to create batch", error: err.message });
  }
};


// List all batches
exports.getAllBatchDetails = async (req, res) => {
  try {
    const batches = await BatchDetails.find();
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch batch details", error: err.message });
  }
};

// Get batch by ObjectId
exports.getBatchDetailsById = async (req, res) => {
  try {
    const batch = await BatchDetails.findById(req.params.id);
    if (!batch) return res.status(404).json({ message: "Batch not found" });
    res.json(batch);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch batch", error: err.message });
  }
};

exports.getCandidatesByBatchId = async (req, res) => {
  try {
    const batch = await BatchDetails.findOne({ batchId: req.params.batchId }, 'candidates');
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    res.json(batch.candidates);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch candidates", error: err.message });
  }
};

// Get batch by custom batchId
exports.getByBatchId = async (req, res) => {
  try {
    const batch = await BatchDetails.findOne({ batchId: req.params.batchId });
    if (!batch) return res.status(404).json({ message: "Batch not found" });
    res.json(batch);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch batch", error: err.message });
  }
};

// Update only status
exports.updateBatchStatus = async (req, res) => {
  try {
    const batch = await BatchDetails.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!batch) return res.status(404).json({ message: "Batch not found" });
    res.json(batch);
  } catch (err) {
    res.status(500).json({ message: "Failed to update batch status", error: err.message });
  }
};

// Advanced lookup: combine with projectInitiation & center info
exports.getBatchesWithDetails = async (req, res) => {
  try {
    const batches = await BatchDetails.aggregate([
      {
        $lookup: {
          from: "projectinitiations",
          let: { scheme: "$scheme", so: "$sanctionOrderNo" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$scheme", "$$scheme"] },
                    { $eq: ["$sanctionOrderNo", "$$so"] }
                  ]
                }
              }
            }
          ],
          as: "projectInfo"
        }
      },
      { $unwind: { path: "$projectInfo", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "centers",
          localField: "centerId",
          foreignField: "centerId",
          as: "centerInfo"
        }
      },
      { $unwind: { path: "$centerInfo", preserveNullAndEmptyArrays: true } }
    ]);

    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch batch details", error: err.message });
  }
};

// for placement 
exports.getCandidatesByBatchId = async (req, res) => {
  try {
    const batch = await BatchDetails.findOne({ _id: req.params.batchId })
      .populate("candidates", "_id name"); // ✅ Only fetch id & name

    if (!batch) return res.status(404).json({ message: "Batch not found" });

    res.json(batch.candidates); // ✅ Return detailed candidates
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch candidates", error: err.message });
  }
};


exports.deleteBatchDetails = async (req, res) => {
  try {
    const batch = await BatchDetails.findByIdAndDelete(req.params.id);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    res.json({ message: 'Batch deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete batch', error: err.message });
  }
};

// Full batch details update
exports.updateBatchDetailsById = async (req, res) => {
  try {
    const updatedBatch = await BatchDetails.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBatch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.json(updatedBatch);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update batch', error: err.message });
  }
};


// batchDetailsController.js

exports.getByBatchCode = async (req, res) => {
  try {
    const batchCode = req.params.batchCode.trim();
    // Case insensitive search karne ke liye:
    const batch = await BatchDetails.findOne({ batchCode: new RegExp(`^${batchCode}$`, 'i') });
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch batch", error: error.message });
  }
};



