const PerfilProfesional = require('../models/PerfilProfesional');

// GET /api/v1/perfil-profesional/mio
async function obtenerMio(req, res) {
  try {
    const perfil = await PerfilProfesional.findOne({ usuario: req.usuarioId });
    // Puede no existir todavía (usuario recién registrado, sin perfil cargado) — no es error.
    return res.json(perfil || null);
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener tu perfil.', detalle: err.message });
  }
}

// PUT /api/v1/perfil-profesional/mio
// Crea el perfil si no existe, o lo actualiza si ya existe (upsert).
async function guardarMio(req, res) {
  try {
    const {
      oficio,
      categoria,
      matriculaHabilitante,
      skills,
      about,
      experienciaAnios,
      precioReferencia,
      disponible,
    } = req.body;

    const faltantes = [];
    if (!oficio) faltantes.push('oficio');
    if (!categoria) faltantes.push('categoria');
    if (precioReferencia === undefined || precioReferencia === null || precioReferencia === '') {
      faltantes.push('precioReferencia');
    }

    if (faltantes.length > 0) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios.',
        campos_faltantes: faltantes,
      });
    }

    const perfil = await PerfilProfesional.findOneAndUpdate(
      { usuario: req.usuarioId },
      {
        usuario: req.usuarioId,
        oficio,
        categoria,
        matriculaHabilitante,
        skills: Array.isArray(skills) ? skills : [],
        about,
        experienciaAnios: experienciaAnios || 0,
        precioReferencia,
        disponible: disponible !== undefined ? disponible : true,
      },
      { upsert: true, new: true, runValidators: true }
    );

    return res.json(perfil);
  } catch (err) {
    return res.status(500).json({ error: 'Error al guardar tu perfil.', detalle: err.message });
  }
}

module.exports = { obtenerMio, guardarMio };
