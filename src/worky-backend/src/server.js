require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const profesionalesRoutes = require('./routes/profesionales');
const trabajosRoutes = require('./routes/trabajos');
const chatsRoutes = require('./routes/chats');

const app = express();

app.use(cors());
app.use(express.json());

// Chequeo rápido de que el server está vivo
app.get('/', (req, res) => {
  res.json({ status: 'ok', app: 'Worky backend' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profesionales', profesionalesRoutes);
app.use('/api/v1/trabajos', trabajosRoutes);
app.use('/api/v1/chats', chatsRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Worky backend corriendo en http://localhost:${PORT}`);
  });
});
