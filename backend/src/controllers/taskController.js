const { Task, Project, Client } = require('../models');

// Obtener todas las tareas (filtradas por user_id si se proporciona)
exports.getAll = async (req, res) => {
    try {
        const { user_id } = req.query;
        let whereClause = {};

        if (user_id) {
            whereClause.user_id = user_id;
        }

        const tasks = await Task.findAll({
            where: whereClause,
            include: [
                {
                    model: Project,
                    as: 'project',
                    attributes: ['id', 'title'],
                    include: [
                        {
                            model: Client,
                            as: 'client',
                            attributes: ['id', 'full_name']
                        }
                    ]
                }
            ],
            order: [['due_date', 'ASC']]
        });

        res.json(tasks);
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};

// Obtener una tarea por ID
exports.getById = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id, {
            include: [
                {
                    model: Project,
                    as: 'project',
                    attributes: ['id', 'title']
                }
            ]
        });
        if (!task) {
            return res.status(404).json({ msg: 'Tarea no encontrada' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error al obtener tarea:', error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};

// Crear una nueva tarea
exports.create = async (req, res) => {
    try {
        const { title, description, status, due_date, project_id, user_id } = req.body;

        if (!title || !user_id) {
            return res.status(400).json({ msg: 'Faltan datos obligatorios (título o user_id).' });
        }

        const newTask = await Task.create({
            title,
            description,
            status: status || 'Pendiente',
            due_date: due_date || null,
            project_id: project_id || null,
            user_id
        });

        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};

// Actualizar una tarea
exports.update = async (req, res) => {
    try {
        const { title, description, status, due_date, project_id } = req.body;

        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Tarea no encontrada' });
        }

        await task.update({
            title,
            description,
            status,
            due_date: due_date || null,
            project_id: project_id || null
        });

        res.json(task);
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};

// Eliminar una tarea
exports.delete = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Tarea no encontrada' });
        }

        await task.destroy();
        res.json({ msg: 'Tarea eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};
