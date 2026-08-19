const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { crear, detalle, misChangas, disponibles, aceptar, misAsignadas } = require('../controllers/changasController');

router.post('/', requireAuth, crear);
router.get('/mias', requireAuth, misChangas);
router.get('/disponibles', requireAuth, disponibles);
router.get('/asignadas', requireAuth, misAsignadas);
router.patch('/:id/aceptar', requireAuth, aceptar);
router.get('/:id', requireAuth, detalle);

module.exports = router;
