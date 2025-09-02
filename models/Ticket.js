const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
    status: { type: String, default: 'Open' }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);