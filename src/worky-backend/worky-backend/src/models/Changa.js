const mongoose = require('mongoose');

const changaSchema = new mongoose.Schema(
  {
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    profesional: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }, // se asigna al aceptar

    // Los 3 campos obligatorios definidos para POST /api/v1/trabajos
    ubicacion: {
      direccionTexto: { type: String, required: true },
      coordinates: { type: [Number] }, // [longitud, latitud], opcional si aún no tienen Maps integrado
    },
    categoria: {
      type: String,
      required: true,
      enum: ['Plomería', 'Electricidad', 'Gas', 'Albañilería', 'Otro'],
    },
    precioOfrecido: { type: Number, required: true },

    detalle: { type: String },

    estado: {
      type: String,
      enum: ['publicada', 'aceptada', 'en_curso', 'finalizada', 'cancelada'],
      default: 'publicada',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Changa', changaSchema);
