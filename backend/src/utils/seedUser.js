const bcrypt = require('bcrypt');
const { User, sequelize } = require('../models');

async function seedAdminUser() {
    try {
        // Asegurarnos de que las tablas existen (sincronizar por si acaso)
        await sequelize.sync();

        const email = 'admin@freelanceflow.com';
        const password = 'admin123';
        
        // Revisar si ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log('El usuario administrador ya existe.');
            return;
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Crear el usuario
        await User.create({
            username: 'Administrador',
            email: email,
            password_hash: password_hash
        });

        console.log('✅ Usuario administrador inyectado exitosamente.');
    } catch (error) {
        console.error('❌ Error al inyectar usuario:', error);
    } finally {
        process.exit();
    }
}

seedAdminUser();
