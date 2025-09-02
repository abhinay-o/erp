// routes/traineeAttendanceRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/traineeAttendanceController");

// GET candidates for a batch (to render the form)
router.get("/batch/:batchId/candidates", controller.getBatchCandidates);

// Create attendance
router.post("/", controller.createTraineeAttendance);

// Get attendance by batch, optional ?date=yyyy-mm-dd
router.get("/:batchId", controller.getTraineeAttendanceByBatch);

module.exports = router;
