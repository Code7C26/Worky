const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { crear, detalle, misChangas } = require('../controllers/changasController');

router.post('/', requireAuth, crear);
router.get('/mias', requireAuth, misChangas);
router.get('/:id', requireAuth, detalle);

module.exports = router;
