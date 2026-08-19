const Changa = require('../models/Changa');
const PerfilProfesional = require('../models/PerfilProfesional');

// POST /api/v1/trabajos
// La documentación del proyecto dice: ubicación, categoría y precio ofrecido
// son obligatorios. Si falta uno, el "pin" tira error — así lo implementamos acá.
async function crear(req, res) {
  try {
    const { ubicacion, categoria, precioOfrecido, detalle } = req.body;

    const faltantes = [];
    if (!ubicacion || !ubicacion.direccionTexto) faltantes.push('ubicacion');
    if (!categoria) faltantes.push('categoria');
    if (precioOfrecido === undefined || precioOfrecido === null || precioOfrecido === '') {
      faltantes.push('precioOfrecido');
    }

    if (faltantes.length > 0) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios.',
        campos_faltantes: faltantes,
      });
    }

    const changa = await Changa.create({
      cliente: req.usuarioId, // viene del middleware requireAuth
      ubicacion,
      categoria,
      precioOfrecido,
      detalle,
    });

    // Acá es donde, más adelante, se dispara el "Pin de Salida / Alerta de Trabajo":
    // buscar profesionales de esa categoría en un radio de 5km y notificarles por FCM.
    // Ver TODO en routes/alertas.js

    return res.status(201).json(changa);
  } catch (err) {
    return res.status(500).json({ error: 'Error al crear la changa.', detalle: err.message });
  }
}

// GET /api/v1/trabajos/:id
async function detalle(req, res) {
  try {
    const changa = await Changa.findById(req.params.id)
      .populate('cliente', 'nombre telefono')
      .populate('profesional', 'nombre telefono');

    if (!changa) {
      return res.status(404).json({ error: 'Changa no encontrada.' });
    }

    return res.json(changa);
  } catch (err) {
    return res.status(500).json({ error: 'Error al buscar la changa.', detalle: err.message });
  }
}

// GET /api/v1/trabajos/mias — changas del usuario logueado (como cliente)
async function misChangas(req, res) {
  try {
    const changas = await Changa.find({ cliente: req.usuarioId }).sort({ createdAt: -1 });
    return res.json(changas);
  } catch (err) {
    return res.status(500).json({ error: 'Error al listar tus changas.', detalle: err.message });
  }
}

// GET /api/v1/trabajos/disponibles
// Le muestra al profesional logueado las changas publicadas de SU categoría, sin asignar todavía.
async function disponibles(req, res) {
  try {
    const miPerfil = await PerfilProfesional.findOne({ usuario: req.usuarioId });

    if (!miPerfil) {
      return res.status(400).json({
        error: 'Todavía no cargaste tu perfil profesional (categoría, precio, etc.). Completalo primero.',
      });
    }

    const changas = await Changa.find({
      categoria: miPerfil.categoria,
      estado: 'publicada',
    })
      .populate('cliente', 'nombre')
      .sort({ createdAt: -1 });

    return res.json(changas);
  } catch (err) {
    return res.status(500).json({ error: 'Error al buscar changas disponibles.', detalle: err.message });
  }
}

// PATCH /api/v1/trabajos/:id/aceptar
async function aceptar(req, res) {
  try {
    const changa = await Changa.findById(req.params.id);

    if (!changa) {
      return res.status(404).json({ error: 'Changa no encontrada.' });
    }
    if (changa.estado !== 'publicada') {
      return res.status(409).json({ error: 'Esta changa ya fue tomada por otro profesional.' });
    }

    changa.profesional = req.usuarioId;
    changa.estado = 'aceptada';
    await changa.save();

    const changaConCliente = await changa.populate('cliente', 'nombre');
    return res.json(changaConCliente);
  } catch (err) {
    return res.status(500).json({ error: 'Error al aceptar la changa.', detalle: err.message });
  }
}

// GET /api/v1/trabajos/asignadas — changas que este profesional ya aceptó (para entrar a chatear)
async function misAsignadas(req, res) {
  try {
    const changas = await Changa.find({
      profesional: req.usuarioId,
      estado: { $in: ['aceptada', 'en_curso'] },
    })
      .populate('cliente', 'nombre')
      .sort({ createdAt: -1 });

    return res.json(changas);
  } catch (err) {
    return res.status(500).json({ error: 'Error al buscar tus changas asignadas.', detalle: err.message });
  }
}

module.exports = { crear, detalle, misChangas, disponibles, aceptar, misAsignadas };
