const BatchDetails = require('../models/BatchDetails');

async function generateNextBatchId() {
  const latest = await BatchDetails.findOne().sort({ createdAt: -1 });
  let nextNum = 1;
  if (latest && latest.batchId) {
    const match = latest.batchId.match(/B_ID(\d+)/);
    if (match) {
      nextNum = parseInt(match[1], 10) + 1;
    }
  }
  return 'B_ID' + String(nextNum).padStart(3, '0');
}

module.exports = generateNextBatchId;
