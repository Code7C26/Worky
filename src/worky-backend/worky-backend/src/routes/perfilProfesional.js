const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { obtenerMio, guardarMio } = require('../controllers/perfilProfesionalController');

router.get('/mio', requireAuth, obtenerMio);
router.put('/mio', requireAuth, guardarMio);

module.exports = router;
