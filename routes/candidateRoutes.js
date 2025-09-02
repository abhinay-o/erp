// path - backend\routes\candidateRoutes.js

const express = require('express');
const router = express.Router();
const {
  createCandidate,
  getCandidates,
  getCandidateById,
   getCandidateByCandidateId, 
  updateCandidate,
  deleteCandidate
} = require('../controllers/candidateController');
const checkPermission = require('../middleware/checkPermission');

// ✅ Removed authMiddleware completely

router.get('/by-candidate-id/:candidateId', getCandidateByCandidateId);

router.post('/', createCandidate);
router.get('/', getCandidates);
router.get('/:id', getCandidateById);
router.put('/:id', updateCandidate);
router.delete('/:id', deleteCandidate);
router.post('/', checkPermission('candidate', 'canAdd'), createCandidate);
router.put('/:id',  checkPermission('candidate', 'canEdit'), updateCandidate);
router.delete('/:id', checkPermission('candidate', 'canDelete'), deleteCandidate);

module.exports = router;
