const Candidate = require('../models/Candidate');

const generateCandidateId = async () => {
  const prefix = 'CD';
  
  // Current year and month name
  const now = new Date();
  const year = now.getFullYear();
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", 
                      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const month = monthNames[now.getMonth()];

  // Regex to match format CDYYYYMONXXXX (e.g., CD2025JUN0001)
  const regexPattern = `^${prefix}${year}${month}`;

  // Find the latest candidate for the current year & month
  const latestCandidate = await Candidate.findOne({ candidateId: { $regex: regexPattern } })
    .sort({ createdAt: -1 });

  let count = 1;
  if (latestCandidate && latestCandidate.candidateId) {
    // Extract the last 4 digits
    const lastCount = parseInt(latestCandidate.candidateId.slice(-4), 10);
    if (!isNaN(lastCount)) count = lastCount + 1;
  }

  // Generate new candidate ID
  const candidateId = `${prefix}${year}${month}${String(count).padStart(4, '0')}`;

  return candidateId;
};

module.exports = generateCandidateId;
