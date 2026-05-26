const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // project_id se definirá en las relaciones
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'Pendiente'
  },
  due_date: {
    type: DataTypes.DATEONLY
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'tasks',
  timestamps: false
});

module.exports = Task;
