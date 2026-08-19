const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    telefono: { type: String },
    rol: {
      type: String,
      enum: ['cliente', 'profesional', 'admin'],
      required: true,
      default: 'cliente',
    },
    ubicacion: {
      // GeoJSON Point — habilita búsquedas geoespaciales (2dsphere) más adelante
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitud, latitud]
        default: [0, 0],
      },
      direccionTexto: { type: String },
    },
    activo: { type: Boolean, default: true },
    expoPushToken: { type: String }, // token de notificaciones push del dispositivo
  },
  { timestamps: true } // agrega createdAt / updatedAt automáticamente
);

usuarioSchema.index({ ubicacion: '2dsphere' });

module.exports = mongoose.model('Usuario', usuarioSchema);
