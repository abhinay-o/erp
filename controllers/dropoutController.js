// backend/controllers/dropoutController.js
const Dropout = require('../models/Dropout');
const BatchDetails = require('../models/BatchDetails'); // existing model in your project

exports.list = async (req, res) => {
  try {
    const filter = {};
    if (req.query.batchId) filter.batchId = req.query.batchId;
    const items = await Dropout.find(filter).sort({ dropoutDate: -1, createdAt: -1 }).lean();
    res.json(items);
  } catch (e) {
    console.error('dropout.list', e);
    res.status(500).json({ message: 'Failed to fetch', error: e.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const item = await Dropout.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) {
    console.error('dropout.getOne', e);
    res.status(500).json({ message: 'Failed', error: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    console.log('POST /api/dropouts body:', req.body);
    const { batchId, candidateId, dropoutDate, reason, remarks } = req.body;
    if (!batchId || !candidateId || !dropoutDate) {
      return res.status(400).json({ message: 'batchId, candidateId, dropoutDate required' });
    }

    // tolerant candidate name fetch from BatchDetails
    let candidateName = '';
    const batch = await BatchDetails.findOne({ batchId }).lean();
    if (batch && Array.isArray(batch.candidates)) {
      const c = batch.candidates.find(x => String(x.candidateId) === String(candidateId));
      if (c) candidateName = c.name || `${c.first_name || ''} ${c.last_name || ''}`.trim();
    }

    const doc = await Dropout.create({
      batchId,
      candidateId,
      candidateName,
      dropoutDate: new Date(dropoutDate),
      reason,
      remarks,
      createdBy: req.user?.id || null,
    });

    res.status(201).json(doc);
  } catch (e) {
    console.error('dropout.create', e);
    res.status(500).json({ message: 'Create failed', error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { batchId, candidateId, dropoutDate, reason, remarks } = req.body;
    let candidateName;
    if (batchId && candidateId) {
      const batch = await BatchDetails.findOne({ batchId }).lean();
      if (batch && Array.isArray(batch.candidates)) {
        const c = batch.candidates.find(x => String(x.candidateId) === String(candidateId));
        if (c) candidateName = c.name || `${c.first_name || ''} ${c.last_name || ''}`.trim();
      }
    }

    const updated = await Dropout.findByIdAndUpdate(
      req.params.id,
      { batchId, candidateId, dropoutDate: new Date(dropoutDate), reason, remarks, ...(candidateName ? { candidateName } : {}) },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) {
    console.error('dropout.update', e);
    res.status(500).json({ message: 'Update failed', error: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const ok = await Dropout.findByIdAndDelete(req.params.id);
    if (!ok) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    console.error('dropout.remove', e);
    res.status(500).json({ message: 'Delete failed', error: e.message });
  }
};

// lightweight batches with candidates (used by frontend)
exports.batchesLite = async (req, res) => {
  try {
    const rows = await BatchDetails.find({}, {
      _id: 0, batchId: 1, jobRole: 1, center: 1, candidates: 1
    }).lean();
    res.json(rows);
  } catch (e) {
    console.error('dropout.batchesLite', e);
    res.status(500).json({ message: 'Failed to fetch batches', error: e.message });
  }
};
