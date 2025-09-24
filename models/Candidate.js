//path -  models/Candidate.js

const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
 candidateId: {
    type: String,
    unique: true,
    required: true,
  },
  first_name: { type: String, required: true },
  middle_name: String,
  last_name: { type: String, required: true },
  gender: {
  type: String,
  enum: ['Male', 'Female', 'Other'],
  required: true
},
  dob: { type: Date },  
  age: Number,
  mobile_no: { type: String, required: true },
  alternate_contact_no: String,
  email_id: String,
  marital_status: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
  religion: String,
  minority: { type: String, enum: ['Yes', 'No'] },
  status: {
  type: String,
  enum: ['Employed', 'Unemployed', 'Student'],
  required: true
},
  father_name: String,
  yearly_income_of_the_candidate_in_rs: Number,

  educational_qualification: String,
  university: String,
  year_of_passing: Number,
  percentage_marks: Number,

  technical_qualification: { type: String, enum: ['Yes', 'No'] },
  technical_other: String,

  skill_trained_before: { type: String, enum: ['Yes', 'No'] },
  training_program_name: String,

  work_experience: { type: String, enum: ['Yes', 'No'] },
  experience_years: Number,
  work_type: String,
  work_location: String,

  aadhar: { type: String, required: true },
  mgnrega: String,
  rsby: String,
  bpl: String,
  aay_card: String,
  shg_certification: String,

  pip: String,
  category: String,
  pwd: { type: String, enum: ['Yes', 'No'] },
  pwd_specify: String,
  chronic_disease: String,
  chronic_other: String,

  // Present Address
  present_house_no: String,
  present_street: String,
  present_landmark: String,
  present_village: String,
  present_gram_panchayat: String,
  present_block: String,
  present_district: String,
  present_state: String,
  present_post_office: String,
  present_police_station: String,
  present_pincode: String,

  // Permanent Address
  permanent_house_no: String,
  permanent_street: String,
  permanent_landmark: String,
  permanent_village: String,
  permanent_gram_panchayat: String,
  permanent_block: String,
  permanent_district: String,
  permanent_state: String,
  permanent_post_office: String,
  permanent_police_station: String,
  permanent_pincode: String,

  electricity: { type: String, enum: ['Yes', 'No'] },
  living_rooms: Number,
  vehicles: Number,
  own_house: { type: String, enum: ['Yes', 'No'] },
  assembly_constituency: String,
  parliamentary_constituency: String,

  // Preferences
  interested_trade: String,
  salary_expectation: Number,
  preferred_duration: String,
  met_alumni: { type: String, enum: ['Yes', 'No'] },
  met_employer: { type: String, enum: ['Yes', 'No'] },
  family_or_friend_joining: { type: String, enum: ['Yes', 'No'] },
  willing_to_migrate: { type: String, enum: ['Yes', 'No'] },
  motivation: String,
  continue_studies: { type: String, enum: ['Yes', 'No'] },
  heard_about: String,
}, { timestamps: true,
   strict: false
 });

candidateSchema.index({ candidateId: 1 }, { unique: true });

module.exports = mongoose.model('Candidate', candidateSchema);
