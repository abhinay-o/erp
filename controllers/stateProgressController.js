// controllers/stateProgressController.js
const BatchDetails = require("../models/BatchDetails");
const TraineeAttendance = require("../models/TraineeAttendance");
const ExternalAssessment = require("../models/ExternalAssessment");
const CertificateDistribution = require("../models/CertificateDistribution");

exports.getStateProgress = async (req, res) => {
  try {
    const today = new Date();
    const { scheme, state, from, to } = req.query;

    // ✅ Filters for batches
    const filters = {};
    if (scheme) filters.scheme = scheme;
    if (state) filters.state = state;
    if (from || to) {
      filters["trainingSchedule.startDate"] = {};
      if (from) filters["trainingSchedule.startDate"].$gte = new Date(from);
      if (to) filters["trainingSchedule.startDate"].$lte = new Date(to);
    }

    // ✅ Fetch all batches
    const batches = await BatchDetails.find(filters).lean();
    if (batches.length === 0) {
      return res.status(200).json({
        success: true,
        report: {},
        message: "No batches found for the applied filters",
      });
    }

    const stateStats = {};

    for (const batch of batches) {
      const {
        batchId,
        state,
        candidates,
        trainingSchedule
      } = batch;

      // Initialize state object if not exists
      if (!stateStats[state]) {
        stateStats[state] = {
          totalCandidates: 0,
          candidatesFreezed: 0,
          undergoing: 0,
          trained: 0,
          dropout: 0,
          assessed: 0,
          certified: 0,
          appointed: 0,
          placed: 0,
        };
      }

      // ✅ Total candidates
      stateStats[state].totalCandidates += candidates.length;

      // ✅ Freezed candidates
      stateStats[state].candidatesFreezed += candidates.filter(c => c.isFreezed).length;

      // ✅ Attendance calculation
      const attendanceDocs = await TraineeAttendance.find({ batchId }).lean();
      const totalSessions = attendanceDocs.length;
      const candidateAttendanceMap = {};

      for (const session of attendanceDocs) {
        for (const record of session.records) {
          if (!candidateAttendanceMap[record.traineeId]) {
            candidateAttendanceMap[record.traineeId] = 0;
          }
          if (record.present) {
            candidateAttendanceMap[record.traineeId]++;
          }
        }
      }

      // ✅ Candidate-wise calculation
      for (const candidate of candidates) {
        const attended = candidateAttendanceMap[candidate.candidateId] || 0;
        const attendancePercent = totalSessions > 0 ? (attended / totalSessions) * 100 : 0;

        if (trainingSchedule.endDate && new Date(trainingSchedule.endDate) >= today) {
          stateStats[state].undergoing++;
        } else if (attendancePercent >= 70) {
          stateStats[state].trained++;
        } else {
          stateStats[state].dropout++;
        }

        // ✅ Count appointed & placed
        if (candidate.status === "Appointed") stateStats[state].appointed++;
        if (candidate.status === "Placed") stateStats[state].placed++;
      }

      // ✅ Assessments
      const assessments = await ExternalAssessment.findOne({ batchId }).lean();
      if (assessments && assessments.assessments) {
        stateStats[state].assessed += assessments.assessments.length;
      }

      // ✅ Certificates
      const certifiedCount = await CertificateDistribution.countDocuments({ batchId });
      stateStats[state].certified += certifiedCount;
    }

    return res.status(200).json({
      success: true,
      report: stateStats,
    });

  } catch (error) {
    console.error("Error generating state progress report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate state progress report",
      error: error.message,
    });
  }
};
