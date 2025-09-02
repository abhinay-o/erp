// routes/inspectionRoutes.js
const express = require("express");
const router = express.Router();
const inspectionController = require("../controllers/inspectionController");

const checkPermission = require('../middleware/checkPermission');

router.post("/", inspectionController.createInspection);
router.get("/", inspectionController.getAllInspections);
router.get("/:id", inspectionController.getInspectionById);
router.put("/:id", inspectionController.updateInspection);
router.delete("/:id", inspectionController.deleteInspection);


router.post("/", checkPermission('inspection', 'canAdd'), inspectionController.createInspection);
router.put("/:id", checkPermission('inspection', 'canEdit'), inspectionController.updateInspection);
router.delete("/:id", checkPermission('inspection', 'canDelete'), inspectionController.deleteInspection);

module.exports = router;
