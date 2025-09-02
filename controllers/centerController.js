const mongoose = require('mongoose'); // ✅ missing import added
const Center = require('../models/Center');
const generateCenterId = require('../utils/generateCenterId');

// ✅ Create center
exports.createCenter = async (req, res) => {
  try {
    const centerId = await generateCenterId();

    const newCenter = new Center({
      ...req.body,
      centerId,
    });

    await newCenter.save();
    res.status(201).json(newCenter);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create center', error: err.message });
  }
};

// ✅ Get all centers
exports.getAllCenters = async (req, res) => {
  try {
    const centers = await Center.find().sort({ createdAt: -1 });
    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch centers', error });
  }
};

// ✅ Get center by ID
exports.getCenterById = async (req, res) => {
  const id = req.params.id;
  try {
    const center = await Center.findById(id);
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }
    res.json(center);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch center', error });
  }
};

// ✅ Update center by ID (with fixes)
exports.updateCenter = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid Center ID' });
  }

  try {
    // Convert string numbers to actual numbers
    const numFields = [
      "busDistance", "autoDistance", "railwayDistance", "latitude", "longitude",
      "capacityTotal", "capacityMale", "capacityFemale", "buildingArea",
      "maleToilets", "femaleToilets", "maleUrinals", "maleWashBasins",
      "femaleWashBasins", "biometricDevices", "printerScanner",
      "digitalCamera", "fireExtinguishers"
    ];
    numFields.forEach(f => {
      if (req.body[f] !== undefined && req.body[f] !== null && req.body[f] !== '') {
        req.body[f] = Number(req.body[f]);
      }
    });

    // Convert DOB fields if trainers exist
    if (req.body.trainers && Array.isArray(req.body.trainers)) {
      req.body.trainers = req.body.trainers.map(t => ({
        ...t,
        dob: t.dob ? new Date(t.dob) : null
      }));
    }

    const updated = await Center.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Center not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating center:', error);
    res.status(500).json({ message: 'Failed to update center', error: error.message });
  }
};

// ✅ Delete center
exports.deleteCenter = async (req, res) => {
  try {
    const deleted = await Center.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Center not found' });
    }
    res.json({ message: 'Center deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete center', error: err.message });
  }
};

// ✅ Get center by centerId
exports.getCenterByCenterId = async (req, res) => {
  try {
    const center = await Center.findOne({ centerId: req.params.centerId });
    if (!center) {
      return res.status(404).json({ message: "Center not found" });
    }
    res.json(center);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch center", error: err.message });
  }
};