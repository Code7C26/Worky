// Carga datos de prueba en la base "worky": 3 usuarios profesionales + sus perfiles.
// Uso: node src/seed.js
// Podés correrlo las veces que quieras — antes de insertar, borra los datos de prueba anteriores.

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Usuario = require('./models/Usuario');
const PerfilProfesional = require('./models/PerfilProfesional');

const profesionalesDemo = [
  {
    nombre: 'Roberto Giménez',
    email: 'roberto.demo@worky.com',
    oficio: 'Gasista matriculado',
    categoria: 'Gas',
    skills: ['Matrícula habilitante', 'Instalaciones de gas', 'Reparaciones'],
    about: 'Gasista matriculado con más de 6 años de experiencia en instalaciones domiciliarias y reparaciones de urgencia en zona sur de Córdoba.',
    experienciaAnios: 6,
    precioReferencia: 15000,
    verificado: true,
    rating: 4.9,
    cantidadChangas: 128,
    coordinates: [-64.4281, -31.6539], // [lng, lat] — Alta Gracia aprox.
  },
  {
    nombre: 'Sofía López',
    email: 'sofia.demo@worky.com',
    oficio: 'Electricista',
    categoria: 'Electricidad',
    skills: ['Instalaciones domiciliarias', 'Tableros', 'Urgencias'],
    about: 'Electricista con 4 años de experiencia en instalaciones residenciales y mantenimiento preventivo.',
    experienciaAnios: 4,
    precioReferencia: 12000,
    verificado: true,
    rating: 4.7,
    cantidadChangas: 94,
    coordinates: [-64.4180, -31.6600],
  },
  {
    nombre: 'Diego Paz',
    email: 'diego.demo@worky.com',
    oficio: 'Plomero',
    categoria: 'Plomería',
    skills: ['Destapaciones', 'Instalación de cañerías', 'Urgencias'],
    about: 'Plomero con 8 años de trayectoria, especializado en destapaciones y reparaciones de urgencia.',
    experienciaAnios: 8,
    precioReferencia: 10000,
    verificado: true,
    rating: 4.8,
    cantidadChangas: 156,
    coordinates: [-64.4350, -31.6480],
  },
];

async function seed() {
  await connectDB();

  console.log('🧹 Borrando datos de prueba anteriores (emails @worky.com)...');
  const anteriores = await Usuario.find({ email: /@worky\.com$/ }).select('_id');
  const idsAnteriores = anteriores.map((u) => u._id);
  await PerfilProfesional.deleteMany({ usuario: { $in: idsAnteriores } });
  await Usuario.deleteMany({ email: /@worky\.com$/ });

  const passwordHash = await bcrypt.hash('123456', 10); // password de prueba para todos

  for (const p of profesionalesDemo) {
    const usuario = await Usuario.create({
      nombre: p.nombre,
      email: p.email,
      passwordHash,
      rol: 'profesional',
      ubicacion: {
        type: 'Point',
        coordinates: p.coordinates,
        direccionTexto: 'Alta Gracia, Córdoba',
      },
    });

    await PerfilProfesional.create({
      usuario: usuario._id,
      oficio: p.oficio,
      categoria: p.categoria,
      skills: p.skills,
      about: p.about,
      experienciaAnios: p.experienciaAnios,
      precioReferencia: p.precioReferencia,
      verificado: p.verificado,
      rating: p.rating,
      cantidadChangas: p.cantidadChangas,
    });

    console.log(`✅ Creado: ${p.nombre} (${p.email} / password: 123456)`);
  }

  console.log('🎉 Listo. Ya podés pedir GET /api/v1/profesionales y vas a ver estos 3.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Error al poblar la base:', err);
  process.exit(1);
});
