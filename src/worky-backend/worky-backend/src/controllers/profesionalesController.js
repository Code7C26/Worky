const PerfilProfesional = require('../models/PerfilProfesional');

// GET /api/v1/profesionales?categoria=Gas&lat=..&lng=..&radioKm=5
async function listar(req, res) {
  try {
    const { categoria, lat, lng, radioKm } = req.query;

    const filtro = {};
    if (categoria && categoria !== 'Todos') {
      filtro.categoria = categoria;
    }

    let query = PerfilProfesional.find(filtro).populate(
      'usuario',
      'nombre ubicacion'
    );

    // Si mandan coordenadas, filtramos por radio geoespacial sobre el usuario asociado.
    // (Requiere que el front ya esté mandando lat/lng reales via expo-location + Google Maps).
    if (lat && lng) {
      const radioMetros = (Number(radioKm) || 5) * 1000;
      const Usuario = require('../models/Usuario');
      const cercanos = await Usuario.find({
        ubicacion: {
          $near: {
            $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
            $maxDistance: radioMetros,
          },
        },
      }).select('_id');

      const ids = cercanos.map((u) => u._id);
      query = query.where('usuario').in(ids);
    }

    const profesionales = await query.exec();
    return res.json(profesionales);
  } catch (err) {
    return res.status(500).json({ error: 'Error al listar profesionales.', detalle: err.message });
  }
}

// GET /api/v1/profesionales/:id
async function detalle(req, res) {
  try {
    const perfil = await PerfilProfesional.findById(req.params.id).populate(
      'usuario',
      'nombre telefono ubicacion'
    );

    if (!perfil) {
      return res.status(404).json({ error: 'Profesional no encontrado.' });
    }

    return res.json(perfil);
  } catch (err) {
    return res.status(500).json({ error: 'Error al buscar profesional.', detalle: err.message });
  }
}

module.exports = { listar, detalle };
