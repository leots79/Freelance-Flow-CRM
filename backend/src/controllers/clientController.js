const { Client } = require('../models');

// Obtener todos los clientes (filtrados por user_id si se proporciona)
exports.getAll = async (req, res) => {
    try {
        const { user_id } = req.query;
        let whereClause = {};
        
        if (user_id) {
            whereClause.user_id = user_id;
        }

        const clients = await Client.findAll({
            where: whereClause,
            order: [['full_name', 'ASC']]
        });
        
        res.json(clients);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};

// Obtener un cliente por ID
exports.getById = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }
        res.json(client);
    } catch (error) {
        console.error('Error al obtener cliente:', error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};

// Crear un nuevo cliente
exports.create = async (req, res) => {
    try {
        const { full_name, company, tax_id, email, phone, status, user_id } = req.body;

        if (!full_name || !user_id) {
            return res.status(400).json({ msg: 'Faltan datos obligatorios (nombre o user_id).' });
        }

        const newClient = await Client.create({
            full_name,
            company,
            tax_id,
            email,
            phone,
            status: status || 'Activo',
            user_id
        });

        res.status(201).json(newClient);
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};

// Actualizar un cliente
exports.update = async (req, res) => {
    try {
        const { full_name, company, tax_id, email, phone, status } = req.body;
        
        const client = await Client.findByPk(req.params.id);
        if (!client) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        await client.update({
            full_name,
            company,
            tax_id,
            email,
            phone,
            status
        });

        res.json(client);
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};

// Eliminar un cliente
exports.delete = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        await client.destroy();
        res.json({ msg: 'Cliente eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};
