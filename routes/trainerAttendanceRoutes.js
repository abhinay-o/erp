// backend/routes/trainerAttendanceRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/trainerAttendanceController");

// Load registered trainers for a batch (for form rendering)
router.get("/batch/:batchId/trainers", controller.getBatchTrainers);

// Create attendance
router.post("/", controller.createTrainerAttendance);

// Get attendance by batch, optional ?date=YYYY-MM-DD
router.get("/:batchId", controller.getTrainerAttendanceByBatch);

module.exports = router;
