const express = require('express');
const router = express.Router();
const controller = require('../controllers/welcomeKitController');
const protect = require('../middleware/authMiddleware'); // your JWT middleware
const checkPermission = require('../middleware/checkPermission');

router.post('/', controller.createKit);
router.get('/', controller.getAllKits);
router.get('/:id', controller.getKitById);
router.put('/:id', controller.updateKit);
router.delete('/:id', controller.deleteKit);



router.get('/', protect, checkPermission('training', 'canView'), controller.getAllKits);
router.post('/', protect, checkPermission('training', 'canAdd'), controller.createKit);
router.get('/:id', protect, checkPermission('training', 'canView'), controller.getKitById);
router.put('/:id', protect, checkPermission('training', 'canEdit'), controller.updateKit);
router.delete('/:id', protect, checkPermission('training', 'canDelete'), controller.deleteKit);




module.exports = router;
