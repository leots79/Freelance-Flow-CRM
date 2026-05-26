const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const { sequelize } = require('./models');
const seedAdminUser = require('./utils/seedUser');
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Configurar CORS para producción y desarrollo
const allowedOrigins = [
    'http://localhost:5500',
    'http://localhost:5501',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5501'
];

// Si existe FRONTEND_URL (la URL de Vercel), agregarla a los orígenes permitidos
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: function (origin, callback) {
        // Permitir peticiones sin origin (ej. Postman, curl, mobile apps)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // En producción, ser más permisivo con subdominios de Vercel
            if (origin && origin.endsWith('.vercel.app')) {
                callback(null, true);
            } else {
                callback(null, true); // Permitir todas por ahora para evitar bloqueos
            }
        }
    },
    credentials: true
}));

app.use(express.json()); // Permite recibir JSON del Frontend
app.use(express.urlencoded({ extended: true }));

// Puerto de configuración
const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.get('/api/health', (req, res) => {
    res.json({ msg: 'API de FreelanceFlow operando correctamente' });
});

sequelize.sync().then(async () => {
    console.log('Base de datos sincronizada exitosamente.');

    // Auto-seed: crear usuario admin si no existe
    await seedAdminUser();

    app.listen(PORT, () => {
        console.log(`Servidor de FreelanceFlow iniciado en puerto ${PORT}`);
    });
}).catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
});
