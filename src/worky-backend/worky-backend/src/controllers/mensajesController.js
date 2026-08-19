const Mensaje = require('../models/Mensaje');
const Changa = require('../models/Changa');

// GET /api/v1/chats/:changaId/mensajes
async function listar(req, res) {
  try {
    const { changaId } = req.params;

    const mensajes = await Mensaje.find({ changa: changaId })
      .sort({ createdAt: 1 })
      .populate('emisor', 'nombre');

    return res.json(mensajes);
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener mensajes.', detalle: err.message });
  }
}

// POST /api/v1/chats/:changaId/mensajes
async function enviar(req, res) {
  try {
    const { changaId } = req.params;
    const { texto } = req.body;

    if (!texto || !texto.trim()) {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío.' });
    }

    const changa = await Changa.findById(changaId);
    if (!changa) {
      return res.status(404).json({ error: 'La changa asociada no existe.' });
    }

    const mensaje = await Mensaje.create({
      changa: changaId,
      emisor: req.usuarioId,
      texto: texto.trim(),
    });

    // Acá es donde se dispararía la notificación push (Firebase Cloud Messaging)
    // al otro participante del chat, si no tiene la app abierta.

    return res.status(201).json(mensaje);
  } catch (err) {
    return res.status(500).json({ error: 'Error al enviar el mensaje.', detalle: err.message });
  }
}

module.exports = { listar, enviar };
