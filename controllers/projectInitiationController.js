const ProjectInitiation = require("../models/ProjectInitiation");
const Proposal = require("../models/Proposal");
const BatchDetails = require("../models/BatchDetails"); 

      const Dropout = require("../models/Dropout");




exports.createProject = async (req, res) => {
  try {
    if (req.body.projectId) {
      delete req.body.projectId;
    }
    const project = new ProjectInitiation(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error('CreateProject error:', err?.message, err?.errors && Object.keys(err.errors));
    return res.status(400).json({ error: err.message, details: err.errors });
  }
};


exports.getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectInitiation.find().sort({ createdAt: -1 });

    const enrichedProjects = await Promise.all(
      projects.map(async (proj) => {
        // Proposal se target
        const proposal = await Proposal.findOne({
          sectionNo: proj.sanctionOrderNo,
          status: "Approved",
        });

        // Related batches
        const batches = await BatchDetails.find({
          scheme: proj.scheme,
          sanctionOrderNo: proj.sanctionOrderNo,
          state: proj.stateName,
        });

        const batchCount = batches.length;

        // ✅ Enrolled candidates count
        const enrolledCount = batches.reduce(
          (sum, b) => sum + (b.candidates?.length || 0),
          0
        );

        // ✅ Dropout count (all batches ke batchId use karke)
        const batchIds = batches.map((b) => b.batchId);
        const dropoutCount = await Dropout.countDocuments({
          batchId: { $in: batchIds },
        });

        return {
          ...proj.toObject(),
          totalTarget: proposal ? proposal.totalTarget : null,
          noOfBatches: batchCount,
          enrolled: enrolledCount,
          dropout: dropoutCount, // 👈 ab yeh frontend me "Dropout" column fill karega
        };
      })
    );

    res.status(200).json(enrichedProjects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
};


exports.getProjectById = async (req, res) => {
  try {
    const project = await ProjectInitiation.findById(req.params.id);
    if (!project)
      return res.status(404).json({ message: "Project not found!" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await ProjectInitiation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!project)
      return res.status(404).json({ message: "Project not found!" });

    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await ProjectInitiation.findByIdAndDelete(req.params.id);
    if (!project)
      return res.status(404).json({ message: "Project not found!" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDropdownOptions = async (req, res) => {
  try {
    const projects = await ProjectInitiation.find(
      {},
      "stateName scheme piaName sanctionOrderNo"
    );
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dropdown options" });
  }
};

exports.getSchemes = async (req, res) => {
  try {
    const schemes = await ProjectInitiation.distinct("scheme");
    res.json(schemes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch schemes",
      error: error.message,
    });
  }
};

exports.getSanctionsByScheme = async (req, res) => {
  try {
    const { scheme } = req.params;
    const sanctions = await ProjectInitiation.find({ scheme }).distinct(
      "sanctionOrderNo"
    );
    res.json(sanctions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStatesBySanction = async (req, res) => {
  try {
    const { sanction } = req.params;
    const states = await ProjectInitiation.find({
      sanctionOrderNo: sanction,
    }).distinct("stateName");
    res.json(states);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDistrictsByState = async (req, res) => {
  try {
    const { state } = req.params;
    const districts = await ProjectInitiation.find({
      stateName: state,
    }).distinct("districtName");
    res.json(districts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// All schemes from approved proposals
exports.getProposalSchemes = async (req, res) => {
  try {
    const schemes = await Proposal.find({ status: 'Approved' }).distinct('projectName');
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Sanctions by scheme from approved proposals
exports.getProposalSanctionsByScheme = async (req, res) => {
  try {
    const { scheme } = req.params;
    if (!scheme) return res.json([]);
    const sanctions = await Proposal.find({ status: 'Approved', projectName: scheme })
                                    .distinct('sectionNo');
    res.json(sanctions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Approved proposals ke liye API
exports.getApprovedProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find(
      { status: 'Approved' },                  // ✅ Sirf approved
      { projectName: 1, sectionNo: 1 }         // ✅ Sirf required fields
    ).sort({ createdAt: -1 });

    // ✅ Dropdown ke liye formatted data
    const formattedData = proposals.map(item => ({
      scheme: item.projectName,           // Dropdown me scheme name
      sanctionOrderNo: item.sectionNo        // Dropdown me sanction order no
    }));

    res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error("Error fetching approved proposals:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch approved proposals"
    });
  }
};
