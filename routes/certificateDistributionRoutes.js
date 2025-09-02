
// backend/routes/certificateDistributionRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/certificateDistributionController");

// Batch meta + candidates for certificate form
router.get("/batch/:batchId/meta", controller.getBatchCertificateMeta);

// Create certificate distribution record
router.post("/", controller.createDistribution);

// Read records by batch
router.get("/batch/:batchId", controller.getByBatchId);

// Delete a distribution record
router.delete("/:id", controller.deleteDistribution);

module.exports = router;
