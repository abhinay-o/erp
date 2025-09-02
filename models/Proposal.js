const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  // sanctionId: { type: String, required: true },
  projectName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  sectionNo: { type: String, required: true },
  totalTarget: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  proposalLetterUrl: {
  type: String,
  required: false,
},

}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
