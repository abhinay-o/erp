// path-  backend\controllers\candidateController.js

const Candidate = require('../models/Candidate');

const generateCandidateId = require('../utils/generateCandidateId');

exports.createCandidate = async (req, res) => {
  try {
    const candidateId = await generateCandidateId();

    const newCandidate = new Candidate({
      ...req.body,
      candidateId,
    });

    await newCandidate.save();
    res.status(201).json(newCandidate);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create candidate', error: err.message });
  }
};

// Get all candidates
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 }); // Removed .populate('batchId')
    res.json(candidates);
  } catch (err) {
    console.error('Get Candidates Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get one candidate
exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id); // Removed .populate('batchId')
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    console.error('Get Candidate By ID Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update candidate
exports.updateCandidate = async (req, res) => {
  try {
    const updated = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Update Candidate Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Delete candidate
exports.deleteCandidate = async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Candidate deleted' });
  } catch (err) {
    console.error('Delete Candidate Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Place in candidateController.js
exports.getCandidateByCandidateId = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ candidateId: req.params.candidateId });
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch candidate', error: err.message });
  }
};

