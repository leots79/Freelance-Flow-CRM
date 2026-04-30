const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');

// Middlewares
app.use(cors());
app.use(express.json()); // Permite recibir JSON del Frontend
app.use(express.urlencoded({ extended: true }));

// Puerto de configuración
const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
    res.json({ msg: 'API de FreelanceFlow operando correctamente' });
});

sequelize.sync({ alter: true }).then(() => {
    console.log('Base de datos sincronizada exitosamente.');
    app.listen(PORT, () => {
        console.log(`Servidor de FreelanceFlow iniciado en puerto ${PORT}`);
    });
}).catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
});
