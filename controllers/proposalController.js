// const Proposal = require('../models/Proposal');

// // GET all
// exports.getProposals = async (req, res) => {
//   const proposals = await Proposal.find();
//   res.json({ proposals });
// };

// // GET by ID
// exports.getProposal = async (req, res) => {
//   const proposal = await Proposal.findById(req.params.id);
//   res.json(proposal);
// };

// // POST create
// // controllers/proposalController.js


// exports.createProposal = async (req, res) => {
//   try {
//     console.log('req.body:', req.body); // Form fields
//     console.log('req.file:', req.file); // Uploaded file

//     const newProposal = new Proposal({
//       projectName: req.body.projectName,
//       startDate: req.body.startDate,
//       endDate: req.body.endDate,
//       sectionNo: req.body.sectionNo,
//       totalTarget: req.body.totalTarget,
//       status: req.body.status,
//       proposalLetterUrl: req.file ? req.file.path : undefined
//     });

//     await newProposal.save();
//     res.status(201).json({ message: 'Proposal created', proposal: newProposal });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };



// // PUT update
// exports.updateProposal = async (req, res) => {
//   const updated = await Proposal.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   res.json(updated);
// };

// // DELETE
// exports.deleteProposal = async (req, res) => {
//   await Proposal.findByIdAndDelete(req.params.id);
//   res.json({ message: 'Deleted successfully' });
// };


const Proposal = require('../models/Proposal');

// GET all
exports.getProposals = async (req, res) => {
  const proposals = await Proposal.find();
  res.json({ proposals });
};

// GET by ID
exports.getProposal = async (req, res) => {
  const proposal = await Proposal.findById(req.params.id);
  res.json(proposal);
};

// POST create
exports.createProposal = async (req, res) => {
  try {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    const newProposal = new Proposal({
      projectName: req.body.projectName,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      sectionNo: req.body.sectionNo,
      totalTarget: req.body.totalTarget,
      status: req.body.status,
      // Normalize Windows backslashes to forward slashes for URLs
      proposalLetterUrl: req.file ? req.file.path.replace(/\\/g, '/') : undefined
    });

    await newProposal.save();
    res.status(201).json({ message: 'Proposal created', proposal: newProposal });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT update
exports.updateProposal = async (req, res) => {
  const updated = await Proposal.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

// DELETE
exports.deleteProposal = async (req, res) => {
  await Proposal.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
};

