// path - backend\routes\batchDetailsRoutes.js

const express = require('express');
const router = express.Router();
const batchDetailsController = require('../controllers/batchDetailsController');
const checkPermission = require('../middleware/checkPermission');

// Create a new batch
router.post('/', batchDetailsController.createBatchDetails);

// Get batches with lookup (should be above `/:id`)
router.get('/with-details', batchDetailsController.getBatchesWithDetails);

// Get all batches
router.get('/', batchDetailsController.getAllBatchDetails);

// Get batch by custom batchId
router.get('/by-batch-id/:batchId', batchDetailsController.getByBatchId);

// Get candidates by batchId
router.get('/candidates/:batchId', batchDetailsController.getCandidatesByBatchId);

// Get batch by MongoDB ObjectId
router.get('/:id', batchDetailsController.getBatchDetailsById);

// Update batch status only (distinct route for status update)
router.put('/:id/status', batchDetailsController.updateBatchStatus);

// Full batch update
router.put('/:id', batchDetailsController.updateBatchDetailsById);

// Delete batch
router.delete('/:id', batchDetailsController.deleteBatchDetails);

router.post('/', checkPermission('batch', 'canAdd'), batchDetailsController.createBatchDetails);
router.put('/:id', checkPermission('batch', 'canEdit'), batchDetailsController.updateBatchDetailsById);
router.delete('/:id', checkPermission('batch', 'canDelete'), batchDetailsController.deleteBatchDetails);
router.put('/:id/status', checkPermission('batch', 'canUpdateStatus'), batchDetailsController.updateBatchStatus);

module.exports = router;
