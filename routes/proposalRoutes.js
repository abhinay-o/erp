// // const express = require('express');
// // const router = express.Router();
// // const proposalController = require('../controllers/proposalController');
// // const authMiddleware = require('../middleware/authMiddleware');
// // const checkPermission = require('../middleware/checkPermission');

// // const multer = require('multer');

// // // Multer setup
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => cb(null, 'uploads/'),
// //   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
// // });
// // const upload = multer({ storage });

// // // POST - create proposal (with file upload)
// // router.post(
// //   '/',
// //   checkPermission('canAdd'),
// //   upload.single('proposalLetter'), // file middleware
// //   proposalController.createProposal
// // );

// // router.use(authMiddleware);

// // router.post('/', proposalController.createProposal);
// // router.get('/', proposalController.getProposals);
// // router.get('/:id', proposalController.getProposal); // ✅ FIXED route name
// // router.put('/:id', proposalController.updateProposal);
// // router.delete('/:id', proposalController.deleteProposal);
// // // Add - sirf admin / super_admin
// // //router.post('/', checkPermission('canAdd'), proposalController.createProposal);
// // router.post('/', checkPermission('canAdd'), upload.single('proposalLetter'), proposalController.createProposal);


// // // Edit - sirf admin / super_admin
// // router.put('/:id', checkPermission('canEdit'), proposalController.updateProposal);

// // // Delete - sirf admin / super_admin
// // router.delete('/:id', checkPermission('canDelete'), proposalController.deleteProposal);


// // module.exports = router;


// const express = require('express');
// const router = express.Router();
// const proposalController = require('../controllers/proposalController');
// const authMiddleware = require('../middleware/authMiddleware');
// const checkPermission = require('../middleware/checkPermission');
// const multer = require('multer');

// // Multer setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
// });
// const upload = multer({ storage });

// // **Use authMiddleware first**
// router.use(authMiddleware);

// // POST - create proposal (only admin/super_admin)
// router.post(
//   '/',
//   checkPermission('proposal','canAdd'),
//   upload.single('proposalLetter'),
//   proposalController.createProposal
// );

// // Other routes
// router.get('/', proposalController.getProposals);
// router.get('/:id', proposalController.getProposal);
// router.put('/:id', checkPermission('canEdit'), proposalController.updateProposal);
// router.delete('/:id', checkPermission('canDelete'), proposalController.deleteProposal);

// module.exports = router;



const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const router = express.Router();
const proposalController = require('../controllers/proposalController');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

// Ensure uploads dir exists with absolute path
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage with absolute destination and Windows-safe filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ts = new Date().toISOString().replace(/:/g, '-'); // Windows-safe
    const safeOriginal = (file.originalname || 'file')
      .replace(/[^\w.\-()+ ]/g, '_');
    cb(null, `${ts}-${safeOriginal}`);
  }
});

const upload = multer({ storage });

// Use auth first
router.use(authMiddleware);

// Create (admin/super_admin only)
router.post(
  '/',
  checkPermission('proposal', 'canAdd'),
  upload.single('proposalLetter'), // must match frontend field name
  proposalController.createProposal
);

// Read
router.get('/', proposalController.getProposals);
router.get('/:id', proposalController.getProposal);

// Update/Delete with consistent permission signature
router.put('/:id', checkPermission('proposal','canEdit'), proposalController.updateProposal);
router.delete('/:id', checkPermission('proposal','canDelete'), proposalController.deleteProposal);

module.exports = router;
