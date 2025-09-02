const express = require("express");
const router = express.Router();
const {
  savePlacement,
  getPlacementByBatchId,
  updatePlacement   // ✅ FIXED
} = require("../controllers/placementController");
const checkPermission = require('../middleware/checkPermission');



router.post("/:batchId", savePlacement);
router.get("/:batchId", getPlacementByBatchId);
router.put("/:batchId", updatePlacement);  // ✅ Now this will work
router.post("/:batchId", checkPermission('placement', 'canAdd'), savePlacement);
router.put("/:batchId", checkPermission('placement', 'canEdit'), updatePlacement);

module.exports = router;
