const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({

  roomType: String,
  roomNo: String,
  length: Number,
  width: Number,
  area: Number,
  maxCapacity: Number,
  floor: String,
  isVentilated: Boolean,
  hasProjector: Boolean,
  hasChairs: Boolean,
});

const trainerSchema = new mongoose.Schema({
  name: String,
  gender: String,
  dob: Date,
  
  qualification: String,

  engagementType: String,
  tradeType: String,
  assignedCourse: String,
  isTOTCertified: Boolean,
  totCertificateNo: String,
  totAgency: String,
  contact: String,
});

const centerSchema = new mongoose.Schema({
  centerId: {
  type: String,
  required: true,
  unique: true
},
  state: String,
  schemeName: String,
  piaName: String,
  sanctionOrderNo: String,
  centerName: String,
  natureOfCenter: String,
  areaType: String,
  addressType: String,
  houseNo: String,
  street: String,
  locality: String,
  landmark: String,
  village: String,
  district: String,
  pincode: String,
  policeStation: String,
  mobile: String,
  email: String,
  busDistance: Number,
  autoDistance: Number,
  railwayDistance: Number,
  latitude: Number,
  longitude: Number,
  // capacityTotal: Number,
  // capacityMale: Number,
  // capacityFemale: Number,
  inchargeName: String,
  inchargeEmail: String,
  inchargeMobile: String,
  ownershipType: String,
  buildingArea: Number,
  roofType: String,
  flooringType: String,
  isStructurallySound: Boolean,
  isPaintedAndPlastered: Boolean,
  maleToilets: Number,
  femaleToilets: Number,
  maleUrinals: Number,
  maleWashBasins: Number,
  femaleWashBasins: Number,
  overheadTank: Boolean,
  powerBackup: Boolean,
  biometricDevices: Number,
  cctvInstalled: Boolean,
  printerScanner: Number,
  digitalCamera: Number,
  fireExtinguishers: Number,
  firstAidKit: Boolean,
  safeDrinkingWaterType: String,
  documentStorage: Boolean,
  rooms: [roomSchema],
  trainers: [trainerSchema],
}, { timestamps: true,
  strict: false
 });

centerSchema.index({ centerId: 1 }, { unique: true });


module.exports = mongoose.model('Center', centerSchema);
