//path-  routes/ojtRoutes.js
const express = require("express");
const router = express.Router();
const ojtController = require("../controllers/ojtController");
const batchDetailsController = require("../controllers/batchDetailsController"); 
const checkPermission = require('../middleware/checkPermission');
const multer = require("multer");

// For file upload (keep as is)
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.get('/by-batch-code/:batchCode', batchDetailsController.getByBatchCode);

// Create with upload
router.post("/", upload.single("ojtCompletionCertificate"), ojtController.createOjt);

// Get all ojts
router.get("/", ojtController.getAllOjts);

router.get('/by-batch-id/:batchId', batchDetailsController.getByBatchId);
// Get OJT by _id
router.get("/:id", ojtController.getOjtById);

// Update full OJT by _id
// (Currently commented out in your code, enable it!)
router.put("/:id", upload.single("ojtCompletionCertificate"), ojtController.updateOjt);

// Update only Status (separate route)
router.put("/:id/status", ojtController.updateOjtStatus);

// Delete OJT by id
router.delete("/:id", ojtController.deleteOjt);


router.post("/", checkPermission('ojt', 'canAdd'), upload.single("ojtCompletionCertificate"), ojtController.createOjt);
router.put("/:id", checkPermission('ojt', 'canEdit'), upload.single("ojtCompletionCertificate"), ojtController.updateOjt);
router.put("/:id/status", checkPermission('ojt', 'canUpdateStatus'), ojtController.updateOjtStatus);
router.delete("/:id", checkPermission('ojt', 'canDelete'), ojtController.deleteOjt);
module.exports = router;
