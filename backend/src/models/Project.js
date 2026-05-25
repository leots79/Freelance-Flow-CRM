const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // client_id se definirá en las relaciones
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  category: {
    type: DataTypes.STRING(50)
  },
  start_date: {
    type: DataTypes.DATEONLY
  },
  deadline: {
    type: DataTypes.DATEONLY
  },
  status: {
    type: DataTypes.STRING(20)
  },
  estimated_income: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
},

advance_paid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
}
}, {
  tableName: 'projects',
  timestamps: false
});

module.exports = Project;
