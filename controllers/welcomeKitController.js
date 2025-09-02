const WelcomeKit = require('../models/WelcomeKit');

// Add Welcome Kit
// Add Welcome Kit
exports.createKit = async (req, res) => {
  try {
    // Destructure candidates also
    const { batchId, kitIssuedDate, issuedBy, trainingCenter, itemsDistributed, remarks, candidates } = req.body;

    if (!batchId || !kitIssuedDate || !issuedBy || !trainingCenter) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const newKit = new WelcomeKit({
      batchId,
      kitIssuedDate,
      issuedBy,
      trainingCenter,
      itemsDistributed,
      remarks,
      candidates // ✅ store individual candidate kit received info
    });

    await newKit.save();
    res.status(201).json(newKit);
  } catch (err) {
    console.error("Error saving welcome kit:", err);
    res.status(500).json({ error: err.message });
  }
};


// Get All Kits
exports.getAllKits = async (req, res) => {
  try {
    const kits = await WelcomeKit.find().sort({ createdAt: -1 });
    res.json(kits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Kit
exports.getKitById = async (req, res) => {
  try {
    const kit = await WelcomeKit.findById(req.params.id);
    res.json(kit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Kit
exports.updateKit = async (req, res) => {
  try {
    const updated = await WelcomeKit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Kit
exports.deleteKit = async (req, res) => {
  try {
    await WelcomeKit.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
