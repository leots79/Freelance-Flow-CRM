const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true, // Automáticamente maneja created_at y updated_at
  createdAt: 'created_at',
  updatedAt: false // En la imagen solo se muestra created_at
});

module.exports = User;
