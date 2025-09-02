const mongoose = require('mongoose');

const candidateAssessmentSchema = new mongoose.Schema({
candidateId: { type: String, required: true },
name: { type: String }, // optional for views
assessmentDate: { type: Date, required: true },
assessorName: { type: String }, // external-specific (optional)
marksObtained: { type: Number, required: true },
totalMarks: { type: Number, required: true },
result: { type: String, enum: ['Pass', 'Fail'] }, // optional but useful
remarks: { type: String }
}, { _id: false });

const ExternalAssessmentSchema = new mongoose.Schema(
{
batchId: { type: String, required: true, index: true, unique: true },
assessments: { type: [candidateAssessmentSchema], default: [] }
},
{ timestamps: true }
);

module.exports = mongoose.model('ExternalAssessment', ExternalAssessmentSchema);
