const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // user_id se definirá en las relaciones
  full_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  company: {
    type: DataTypes.STRING(100)
  },
  tax_id: {
    type: DataTypes.STRING(20)
  },
  email: {
    type: DataTypes.STRING(100),
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  status: {
    type: DataTypes.STRING(20)
  }
}, {
  tableName: 'clients',
  timestamps: false // La imagen no muestra timestamps
});

module.exports = Client;
