const ProjectInitiation = require('../models/ProjectInitiation');
const Candidate = require('../models/Candidate');
const BatchDetails = require('../models/BatchDetails');
const Placement = require('../models/Placement');

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalProjects,
      totalCandidates,
      totalBatches,
      placedAggregate
    ] = await Promise.all([
      ProjectInitiation.countDocuments(),
      Candidate.countDocuments(),
      BatchDetails.countDocuments(),
      Placement.aggregate([
        { $unwind: '$candidates' },
        { $match: { 'candidates.status': 'Placed' } },
        { $count: 'totalPlaced' },
      ])
    ]);

    const totalPlaced = placedAggregate.length ? placedAggregate[0].totalPlaced : 0;

    res.json({
      totalProjects,
      totalCandidates,
      totalBatches,
      totalPlaced
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get dashboard stats' });
  }
};
