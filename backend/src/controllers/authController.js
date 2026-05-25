const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Función para el Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar que se enviaron los datos
        if (!email || !password) {
            return res.status(400).json({ msg: 'Por favor, ingresa correo y contraseña.' });
        }

        // Buscar al usuario
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ msg: 'Credenciales inválidas.' });
        }

        // Verificar la contraseña
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ msg: 'Credenciales inválidas.' });
        }

        // Generar JWT
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret_dev_key',
            { expiresIn: '24h' }
        );

        // Responder con el token
        res.json({
            msg: 'Inicio de sesión exitoso',
            token,
            user: payload
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};
