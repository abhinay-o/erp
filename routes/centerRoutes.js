const express = require('express');
const router = express.Router();
const { createCenter, getAllCenters , deleteCenter, getCenterById,
  updateCenter,getCenterByCenterId} = require('../controllers/centerController');
const protect = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');
const centerController = require('../controllers/centerController');



router.post('/', protect, centerController.createCenter);
router.get('/', protect, getAllCenters);
router.get('/byCenterId/:centerId', protect, getCenterByCenterId);
router.get('/:id', protect, getCenterById);       
router.put('/:id',protect, updateCenter);
router.delete('/:id', protect, deleteCenter);

router.post('/', protect, checkPermission('canAdd'), centerController.createCenter);
router.put('/:id', protect, checkPermission('canEdit'), updateCenter);
router.delete('/:id', protect, checkPermission('canDelete'), deleteCenter);



module.exports = router;
