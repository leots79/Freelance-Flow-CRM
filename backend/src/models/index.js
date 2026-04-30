const sequelize = require('../config/database');

// Importar modelos
const User = require('./User');
const Client = require('./Client');
const Project = require('./Project');
const Invoice = require('./Invoice');

// Definir relaciones

// Un User tiene muchos Clients
User.hasMany(Client, { foreignKey: 'user_id', as: 'clients' });
Client.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Un Client tiene muchos Projects
Client.hasMany(Project, { foreignKey: 'client_id', as: 'projects' });
Project.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

// Un Project tiene muchos Invoices
Project.hasMany(Invoice, { foreignKey: 'project_id', as: 'invoices' });
Invoice.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

module.exports = {
  sequelize,
  User,
  Client,
  Project,
  Invoice
};
