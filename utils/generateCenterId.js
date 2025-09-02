const Center = require('../models/Center');

const generateCenterId = async () => {
  const prefix = 'TC';

  // Find latest center with centerId starting with TC
  const latestCenter = await Center.findOne({ centerId: { $regex: `^${prefix}` } })
    .sort({ createdAt: -1 });

  let count = 1;
  if (latestCenter && latestCenter.centerId) {
    const lastCount = parseInt(latestCenter.centerId.replace(prefix, ''));
    if (!isNaN(lastCount)) count = lastCount + 1;
  }

  const centerId = `${prefix}${String(count).padStart(3, '0')}`; // e.g., TC001
  return centerId;
};

module.exports = generateCenterId;
