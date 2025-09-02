// backend/controllers/ticketController.js

const Ticket = require('../models/Ticket');

// Dynamically generate ticket ID like TQR01, TQR02...
const generateTicketId = async () => {
  const latest = await Ticket.findOne().sort({ createdAt: -1 });
  if (!latest) return "TQR01";

  const lastNum = parseInt(latest.ticketId.slice(3)) || 0;
  const newNum = (lastNum + 1).toString().padStart(2, '0');
  return `TQR${newNum}`;
};


// ✅ Create Ticket
exports.createTicket = async (req, res) => {
  try {
    const ticketId = await generateTicketId(); // async ticket ID
    const newTicket = new Ticket({ ticketId, ...req.body });
    await newTicket.save();
    res.status(201).json({ message: 'Ticket submitted', ticketId });
  } catch (error) {
    console.error("Ticket creation error:", error.message); // helpful log
    res.status(500).json({ error: 'Failed to submit ticket' });
  }
};

// ✅ Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

// ✅ Get single ticket
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Not found' });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
};

// ✅ Update ticket status
exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!ticket) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Status updated', ticket });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
};