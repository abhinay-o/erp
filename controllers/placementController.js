const Placement = require("../models/Placement");

const savePlacement = async (req, res) => {
  const { batchId } = req.params;
  const { department, candidates } = req.body;

  console.log("📥 Received batchId:", batchId);
  console.log("📥 Received formData:", req.body);

  try {
    const newPlacement = new Placement({
      batchId,
      department,
      candidates
    });

    await newPlacement.save();
    console.log("✅ Placement saved successfully");
    res.status(201).json({ message: "Placement saved successfully" });
  } catch (error) {
    console.error("❌ Error saving placement:", error.message);
    res.status(500).json({ message: "Failed to save placement", error: error.message });
  }
};

const getPlacementByBatchId = async (req, res) => {
  const { batchId } = req.params;

  try {
    const placement = await Placement.findOne({ batchId });
    if (!placement) {
      return res.status(404).json({ message: "No placement found for this batch" });
    }
    res.json(placement);
  } catch (error) {
    console.error("❌ Error fetching placement:", error);
    res.status(500).json({ message: "Failed to get placement" });
  }
};

const updatePlacement = async (req, res) => {
  const { batchId } = req.params;
  const { department, candidates } = req.body;

  try {
    const updated = await Placement.findOneAndUpdate(
      { batchId },
      { department, candidates },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Placement not found" });
    res.json({ message: "Updated successfully", updated });
  } catch (error) {
    console.error("❌ Error updating placement:", error.message);
    res.status(500).json({ message: "Failed to update", error: error.message });
  }
};

module.exports = {
  savePlacement,
  getPlacementByBatchId,
  updatePlacement
};
