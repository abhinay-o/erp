const mongoose = require('mongoose');

const projectInitiationSchema = new mongoose.Schema({
  projectId: { type: String, unique: true },
  scheme: { type: String, required: true },
  sanctionOrderNo: { type: String, required: true },
  stateName: { type: String, required: true },
  districtName: { type: String, required: true },
  piaName: { type: String, required: true },
  tradeJobRole: { type: String, required: true },
  sector: { type: String, required: true },
  tradeOfCertification: { type: String, required: true },
  ojtHours: { type: Number, required: true },
  totalDomainHours: { type: Number, required: true },
  totalHours: { type: Number, required: true }
}, { timestamps: true, strict: false });

projectInitiationSchema.pre('save', async function (next) {
  if (!this.projectId || this.projectId.trim() === '') {
    const year = new Date().getFullYear();
    const count = await mongoose.model('ProjectInitiation')
      .countDocuments({ projectId: new RegExp(`^PRJ${year}`) });
    const nextNumber = String(count + 1).padStart(4, '0');
    this.projectId = `PRJ${year}${nextNumber}`;
  }
  next();
});

module.exports = mongoose.model('ProjectInitiation', projectInitiationSchema);
