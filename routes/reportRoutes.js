// routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const BatchDetails = require("../models/BatchDetails");

const {
  getCandidateTrainingReport,
  getBatchWiseCandidateReport,
  getBatchIds,
} = require("../controllers/reportController");

const {
  getStateProgress, // ✅ Correct import name
} = require("../controllers/stateProgressController");


// ---------- Static routes first ----------
router.get("/state-progress", getStateProgress);

router.get("/batch-ids", getBatchIds);
router.get("/candidate-training-status", getCandidateTrainingReport);

// All schemes (for first dropdown)
router.get("/schemes", async (req, res) => {
  try {
    const schemes = await BatchDetails.distinct("scheme");
    res.json(schemes);
  } catch (error) {
    console.error("Error fetching schemes:", error);
    res.status(500).json({ message: "Failed to fetch schemes" });
  }
});

// All states (fallback, optional)
router.get("/states", async (req, res) => {
  try {
    const states = await BatchDetails.distinct("state");
    res.json(states);
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({ message: "Failed to fetch states" });
  }
});

// NEW: states filtered by scheme (dependent dropdown)
router.get("/states-by-scheme", async (req, res) => {
  try {
    const { scheme } = req.query;
    if (!scheme) return res.json([]); // no scheme -> empty list
    const states = await BatchDetails.distinct("state", { scheme });
    res.json(states);
  } catch (error) {
    console.error("Error fetching states by scheme:", error);
    res.status(500).json({ message: "Failed to fetch states by scheme" });
  }
});

// ---------- Dynamic/param routes after static ----------
router.get("/batch-candidates/:batchId", getBatchWiseCandidateReport);
router.post("/derive/batch/:batchId", (req, res) => {
  res.status(501).json({ message: "Not implemented yet" }); // ✅ Avoid missing handler crash
});

module.exports = router;
