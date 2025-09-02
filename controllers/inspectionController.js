// controllers/inspectionController.js
const Inspection = require("../models/Inspection");
const { v4: uuidv4 } = require("uuid"); // for inspectionId

// Create new inspection
exports.createInspection = async (req, res) => {
  try {
    const inspectionId = `INSP-${uuidv4().slice(0, 8).toUpperCase()}`;
    const inspectionData = { ...req.body, inspectionId };
    const inspection = new Inspection(inspectionData);
    await inspection.save();
    res.status(201).json(inspection);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all inspections
exports.getAllInspections = async (req, res) => {
  try {
    const inspections = await Inspection.find().sort({ submittedOn: -1 });
    res.json(inspections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single inspection by ID
exports.getInspectionById = async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) return res.status(404).json({ error: "Not found" });
    res.json(inspection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update inspection
exports.updateInspection = async (req, res) => {
  try {
    const updated = await Inspection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete inspection
exports.deleteInspection = async (req, res) => {
  try {
    const deleted = await Inspection.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
