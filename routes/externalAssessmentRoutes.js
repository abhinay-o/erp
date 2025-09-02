
const express = require("express");
const router = express.Router();
const controller = require("../controllers/externalAssessmentController");

// If you use auth/permissions, uncomment and wrap routes appropriately
// const protect = require("../middleware/authMiddleware");
// const checkPermission = require("../middleware/checkPermission");

/*
  Batch-level operations (one document per batch)

  POST   /api/internal-assessment/upsert                      -> create/replace entire assessments array for a batch
  POST   /api/internal-assessment/append                      -> append candidate assessments (non-destructive)
  GET    /api/internal-assessment/batch/:batchId              -> get one batch’s full assessments document
  PUT    /api/internal-assessment/batch/:batchId/candidate/:candidateId    -> update one candidate’s assessment
  DELETE /api/internal-assessment/batch/:batchId/candidate/:candidateId    -> remove one candidate from batch
  GET    /api/internal-assessment/                            -> list all batch assessment documents (optional admin)
  DELETE /api/internal-assessment/batch/:batchId              -> delete an entire batch’s assessments doc (optional admin)
*/

// Upsert/replace entire set for a batch
// router.post("/upsert", protect, checkPermission("training","canAdd"), controller.upsertBatch);
router.post("/upsert", controller.upsertBatch);

// Append additional candidates without replacing existing ones
// router.post("/append", protect, checkPermission("training","canAdd"), controller.appendAssessments);
router.post("/append", controller.appendAssessments);

// Get one batch (single document)
// router.get("/batch/:batchId", protect, checkPermission("training","canView"), controller.getByBatchId);
router.get("/batch/:batchId", controller.getByBatchId);

// Update a single candidate’s assessment within the batch
// router.put("/batch/:batchId/candidate/:candidateId", protect, checkPermission("training","canEdit"), controller.updateCandidateInBatch);
router.put("/batch/:batchId/candidate/:candidateId", controller.updateCandidateInBatch);

// Remove a candidate from the batch
// router.delete("/batch/:batchId/candidate/:candidateId", protect, checkPermission("training","canDelete"), controller.removeCandidateFromBatch);
router.delete("/batch/:batchId/candidate/:candidateId", controller.removeCandidateFromBatch);

// Optional admin endpoints
// List all batches (useful for admin dashboards)
router.get("/", controller.listAllBatches);

// Delete entire batch document
router.delete("/batch/:batchId", controller.deleteByBatchId);

module.exports = router;
