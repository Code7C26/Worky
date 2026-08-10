const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema(
  {
    changa: { type: mongoose.Schema.Types.ObjectId, ref: 'Changa', required: true },
    emisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    texto: { type: String, required: true, trim: true },
    leido: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Acelera la consulta más común: "traeme todos los mensajes de esta changa, en orden"
mensajeSchema.index({ changa: 1, createdAt: 1 });

module.exports = mongoose.model('Mensaje', mensajeSchema);
