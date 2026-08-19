const express = require('express');
const router = express.Router({ mergeParams: true });
const requireAuth = require('../middleware/requireAuth');
const { listar, enviar } = require('../controllers/mensajesController');

router.get('/:changaId/mensajes', requireAuth, listar);
router.post('/:changaId/mensajes', requireAuth, enviar);

module.exports = router;
