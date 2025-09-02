// backend/routes/dropouts.js
const router = require('express').Router();
const ctrl = require('../controllers/dropoutController');

router.get('/', ctrl.list);           // GET /api/dropouts
router.get('/batches', ctrl.batchesLite); // GET /api/dropouts/batches
router.get('/:id', ctrl.getOne);      // GET /api/dropouts/:id
router.post('/', ctrl.create);        // POST /api/dropouts
router.put('/:id', ctrl.update);      // PUT /api/dropouts/:id
router.delete('/:id', ctrl.remove);   // DELETE /api/dropouts/:id

module.exports = router;
