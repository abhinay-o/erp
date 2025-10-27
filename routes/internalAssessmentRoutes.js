// routes/internalAssessmentRoutes.js

const express = require('express');
const router = express.Router();
const InternalAssessment = require('../models/InternalAssessment');

// POST: Save multiple assessments (ALLOWS DUPLICATES) - ONE BY ONE INSERT
router.post('/upsert-multi', async (req, res) => {
  try {
    console.log('📥 Request received:', JSON.stringify(req.body, null, 2));

    const { batchId, candidateId, assessments } = req.body;

    // Validation
    if (!batchId || !candidateId || !assessments || !Array.isArray(assessments)) {
      console.log('❌ Validation failed - missing required fields');
      return res.status(400).json({ 
        message: 'batchId, candidateId, and assessments array are required',
        received: { batchId, candidateId, assessments: Array.isArray(assessments) }
      });
    }

    if (assessments.length === 0) {
      console.log('❌ Validation failed - empty assessments array');
      return res.status(400).json({ 
        message: 'Assessments array cannot be empty' 
      });
    }

    // Validate each assessment
    for (let i = 0; i < assessments.length; i++) {
      const a = assessments[i];
      if (!a.assessmentDate || !a.examName || !a.subjectName || 
          a.marksObtained === undefined || a.marksObtained === '' || 
          !a.outOf || a.outOf === '') {
        console.log(`❌ Validation failed - assessment ${i} has missing fields:`, a);
        return res.status(400).json({ 
          message: `Assessment ${i + 1} is missing required fields`,
          assessment: a
        });
      }
    }

    // ✅ Insert assessments ONE BY ONE to avoid bulk write errors
    const saved = [];
    const errors = [];

    for (let i = 0; i < assessments.length; i++) {
      const a = assessments[i];
      try {
        const assessmentDoc = new InternalAssessment({
          batchId,
          candidateId,
          assessmentDate: a.assessmentDate,
          examName: a.examName.trim(),
          subjectName: a.subjectName.trim(),
          marksObtained: Number(a.marksObtained),
          outOf: Number(a.outOf),
          passFail: a.passFail || 'pass',
          remarks: a.remarks ? a.remarks.trim() : ''
        });

        const result = await assessmentDoc.save();
        saved.push(result);
        console.log(`✅ Assessment ${i + 1} saved successfully`);
      } catch (error) {
        console.error(`❌ Error saving assessment ${i + 1}:`, error.message);
        errors.push({
          index: i + 1,
          assessment: a,
          error: error.message
        });
      }
    }

    console.log(`✅ Total saved: ${saved.length}, Failed: ${errors.length}`);

    // Return response
    if (saved.length > 0) {
      res.status(200).json({ 
        message: `${saved.length} assessment(s) saved successfully`, 
        count: saved.length,
        data: saved,
        errors: errors.length > 0 ? errors : undefined
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to save any assessments', 
        errors 
      });
    }
  } catch (error) {
    console.error('❌ Error saving assessments:', error);
    res.status(500).json({ 
      message: 'Error saving assessments', 
      error: error.message
    });
  }
});

// GET: Fetch all assessments for a batch
router.get('/batch/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;
    const assessments = await InternalAssessment.find({ batchId })
      .sort({ candidateId: 1, assessmentDate: 1 });
    res.status(200).json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ 
      message: 'Error fetching assessments', 
      error: error.message 
    });
  }
});

// GET: Fetch assessments for a specific candidate in a batch
router.get('/batch/:batchId/candidate/:candidateId', async (req, res) => {
  try {
    const { batchId, candidateId } = req.params;
    const assessments = await InternalAssessment.find({ batchId, candidateId })
      .sort({ assessmentDate: 1 });
    res.status(200).json(assessments);
  } catch (error) {
    console.error('Error fetching candidate assessments:', error);
    res.status(500).json({ 
      message: 'Error fetching candidate assessments', 
      error: error.message 
    });
  }
});

// DELETE: Delete a specific assessment by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await InternalAssessment.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    res.status(200).json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({ 
      message: 'Error deleting assessment', 
      error: error.message 
    });
  }
});

// DELETE: Delete all assessments for a candidate in a batch
router.delete('/batch/:batchId/candidate/:candidateId', async (req, res) => {
  try {
    const { batchId, candidateId } = req.params;
    const result = await InternalAssessment.deleteMany({ batchId, candidateId });
    
    res.status(200).json({ 
      message: 'All assessments deleted for candidate',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting candidate assessments:', error);
    res.status(500).json({ 
      message: 'Error deleting candidate assessments', 
      error: error.message 
    });
  }
});

// GET: Fetch ALL assessments across all batches
router.get('/all', async (req, res) => {
  try {
    console.log('📥 Fetching all assessments');
    const assessments = await InternalAssessment.find()
      .sort({ batchId: 1, candidateId: 1, assessmentDate: 1 });
    
    console.log(`✅ Found ${assessments.length} total assessments`);
    res.status(200).json(assessments);
  } catch (error) {
    console.error('Error fetching all assessments:', error);
    res.status(500).json({ 
      message: 'Error fetching all assessments', 
      error: error.message 
    });
  }
});

// PUT: Update a specific assessment by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { assessmentDate, examName, subjectName, marksObtained, outOf, passFail, remarks } = req.body;

    console.log('📝 Updating assessment:', id);

    // Validation
    if (!assessmentDate || !examName || !subjectName || marksObtained === undefined || !outOf) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    if (Number(marksObtained) > Number(outOf)) {
      return res.status(400).json({ message: 'Marks obtained cannot be greater than total marks' });
    }

    const updated = await InternalAssessment.findByIdAndUpdate(
      id,
      {
        assessmentDate,
        examName: examName.trim(),
        subjectName: subjectName.trim(),
        marksObtained: Number(marksObtained),
        outOf: Number(outOf),
        passFail,
        remarks: remarks ? remarks.trim() : ''
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    console.log('✅ Assessment updated successfully');
    res.status(200).json({ 
      message: 'Assessment updated successfully', 
      data: updated 
    });
  } catch (error) {
    console.error('❌ Error updating assessment:', error);
    res.status(500).json({ 
      message: 'Error updating assessment', 
      error: error.message 
    });
  }
});

module.exports = router;
