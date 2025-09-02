
const express = require('express');
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  deleteTicket // ✅ import this
} = require('../controllers/ticketController');

router.post('/', createTicket);
router.get('/', getAllTickets);
router.get('/:id', getTicketById);
router.put('/:id/status', updateTicketStatus);
router.delete('/:id', deleteTicket); // ✅ works now

module.exports = router;
