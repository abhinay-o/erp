// File: controllers/reportController.js
const Candidate = require('../models/Candidate');
const Batch = require('../models/BatchDetails');
const Placement = require('../models/Placement');
const Attendance = require('../models/TraineeAttendance');

exports.getCandidateTrainingReport = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    const batches = await Batch.find();
    const placements = await Placement.find();
    const attendanceRecords = await Attendance.find();

   const report = candidates.map((candidate) => {
  // Find placement document having this candidate
  const placementDoc = placements.find(p =>
    p.candidates.some(c => c.candidateId === candidate.candidateId)
  );

  const candidatePlacement = placementDoc
    ? placementDoc.candidates.find(c => c.candidateId === candidate.candidateId)
    : null;

  // Find corresponding batch
  const batch = batches.find(b =>
    b.candidates.some(c => c.candidateId === candidate.candidateId)
  );

  const trainingSchedule = batch?.trainingSchedule || {};

  let presentDays = 0;
  if (batch) {
    attendanceRecords.forEach((rec) => {
      if (rec.batchId === batch.batchId) {
        const match = rec.records.find(
          (r) => r.traineeId === candidate.candidateId && r.present
        );
        if (match) presentDays++;
      }
    });
  }

  return {
    candidateId: candidate.candidateId,
    name: `${candidate.first_name} ${candidate.last_name}`,
    category: candidate.category || 'N/A',
    batchId: batch?.batchId || 'N/A',
    trainingStart: trainingSchedule.startDate || 'N/A',
    trainingEnd: trainingSchedule.endDate || 'N/A',
    batchSize: trainingSchedule?.batchSize || 0,
    placementStatus: candidatePlacement?.status === "Placed" ? "Placed" : "Not Placed",
    employer: candidatePlacement?.employerName || '-'
    
  };
});


    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Report Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate report.' });
  }
};


exports.getBatchIds = async (req, res) => {
  try {
    const batches = await Batch.find({}, { batchId: 1, _id: 0 }).lean();
    const batchIds = batches.map(b => b.batchId);
    res.json({ success: true, data: batchIds });
  } catch (error) {
    console.error('Error fetching batch IDs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch batch IDs' });
  }
};


exports.getBatchWiseCandidateReport = async (req, res) => {
  try {
    const { batchId } = req.params;
    const batch = await Batch.findOne({ batchId });
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });

    const candidateIds = batch.candidates.map(c => c.candidateId);

    // Placement query: find all placements having any of these candidateIds in candidates array
    const placements = await Placement.find({ 
      'candidates.candidateId': { $in: candidateIds } 
    });

    const attendanceRecords = await Attendance.find({ batchId });

    const report = batch.candidates.map((candidate) => {
      // Find placement document containing this candidate
      const placementDoc = placements.find(p =>
        p.candidates.some(c => c.candidateId === candidate.candidateId)
      );

      // Find that candidate's placement details
      const candidatePlacement = placementDoc
        ? placementDoc.candidates.find(c => c.candidateId === candidate.candidateId)
        : null;

      let presentDays = 0;
      attendanceRecords.forEach((rec) => {
        const match = rec.records.find(
          (r) => r.traineeId === candidate.candidateId && r.present
        );
        if (match) presentDays++;
      });

      return {
        candidateId: candidate.candidateId,
        name: candidate.name || '-',
        category: candidate.category || 'N/A',
        batchId: batch.batchId,
        trainingStart: batch.trainingSchedule?.startDate || 'N/A',
        trainingEnd: batch.trainingSchedule?.endDate || 'N/A',
        batchSize: batch.trainingSchedule?.batchSize || 0,
        placementStatus: candidatePlacement?.status === "Placed" ? "Placed" : "Not Placed",
        employer: candidatePlacement?.employerName || '-'
      };
    });

    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Batch Report Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate batch report.' });
  }
};





