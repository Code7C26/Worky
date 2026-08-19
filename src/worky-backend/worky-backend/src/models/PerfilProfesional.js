const mongoose = require('mongoose');

const perfilProfesionalSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
      unique: true,
    },
    oficio: { type: String, required: true, trim: true }, // ej: "Gasista matriculado"
    categoria: {
      type: String,
      required: true,
      enum: ['Plomería', 'Electricidad', 'Gas', 'Albañilería', 'Otro'],
    },
    matriculaHabilitante: { type: String }, // nro de matrícula, si aplica
    verificado: { type: Boolean, default: false }, // lo marca un admin tras validar documentación
    skills: [{ type: String }],
    about: { type: String },
    experienciaAnios: { type: Number, default: 0 },
    precioReferencia: { type: Number, required: true }, // valor de la visita/hora
    disponible: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    cantidadChangas: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PerfilProfesional', perfilProfesionalSchema);
