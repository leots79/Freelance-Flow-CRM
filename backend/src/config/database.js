const { Sequelize } = require('sequelize');
const path = require('path');

// Instanciar Sequelize con SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false // Cambiar a true si deseas ver las consultas SQL en consola
});

module.exports = sequelize;
