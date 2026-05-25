const { Project, Client } = require('../models');

// Obtener todos los proyectos (se puede filtrar por client_id o user_id a través del join)
exports.getAll = async (req, res) => {
    try {
        const { user_id, client_id } = req.query;
        let whereClause = {};
        let includeClause = {
            model: Client,
            as: 'client'
        };

        if (client_id) {
            whereClause.client_id = client_id;
        }

        if (user_id) {
            includeClause.where = { user_id: user_id };
        }

        const projects = await Project.findAll({
            where: whereClause,
            include: [includeClause],
            order: [['deadline', 'ASC']]
        });

        res.json(projects);
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};

// Obtener un proyecto por ID
exports.getById = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id, {
            include: [{ model: Client, as: 'client' }]
        });
        if (!project) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }
        res.json(project);
    } catch (error) {
        console.error('Error al obtener proyecto:', error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};

// Crear un nuevo proyecto
exports.create = async (req, res) => {
    try {
        const { title, description, category, start_date, deadline, status, client_id, estimated_income, advance_paid } = req.body;

        if (!title || !client_id) {
            return res.status(400).json({ msg: 'Faltan datos obligatorios (título o cliente).' });
        }

        const newProject = await Project.create({
            title,
            description,
            category,
            start_date,
            deadline,
            status: status || 'En Progreso',
            client_id,

            estimated_income:
                estimated_income || 0,

            advance_paid:
                advance_paid || false
        });

        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error al crear proyecto:', error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};

// Actualizar un proyecto
exports.update = async (req, res) => {
    try {
        const { title, description, category, start_date, deadline, status, client_id, estimated_income, advance_paid } = req.body;

        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        await project.update({
            title,
            description,
            category,
            start_date,
            deadline,
            status,
            client_id, 
            estimated_income, 
            advance_paid
        });

        res.json(project);
    } catch (error) {
        console.error('Error al actualizar proyecto:', error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};

// Eliminar un proyecto
exports.delete = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        await project.destroy();
        res.json({ msg: 'Proyecto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};
