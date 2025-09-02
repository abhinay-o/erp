

const express = require('express');
const router = express.Router();

const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getDropdownOptions,
  getSchemes,
  getSanctionsByScheme,
  getStatesBySanction,
  getDistrictsByState,
  getApprovedProposals,
   getProposalSchemes,
  getProposalSanctionsByScheme,
} = require('../controllers/projectInitiationController');

const protect = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

// Create
router.post('/', protect, checkPermission('project','canAdd'), createProject);

// Read list
router.get('/', protect, checkPermission('project','canView'), getAllProjects);

// Approved proposals (dropdown)
router.get('/approved-proposals', getApprovedProposals);

// Dropdown options
router.get('/dropdown-options', getDropdownOptions);

// Cascading dropdown chain
router.get('/schemes', getSchemes);
router.get('/sanctions/:scheme', protect, getSanctionsByScheme);
router.get('/states/:sanction', protect, getStatesBySanction);
router.get('/districts/:state', protect, getDistrictsByState);
router.get('/proposal/schemes', getProposalSchemes);
router.get('/proposal/sanctions/:scheme', getProposalSanctionsByScheme);

// Read by ID
router.get('/:id', protect, checkPermission('project','canView'), getProjectById);

// Update
router.put('/:id', protect, checkPermission('project','canEdit'), updateProject);

// Delete
router.delete('/:id', protect, checkPermission('project','canDelete'), deleteProject);





module.exports = router;


