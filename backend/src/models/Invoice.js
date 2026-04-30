const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // project_id se definirá en las relaciones
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  tax_rate: {
    type: DataTypes.DECIMAL(5, 2)
  },
  total: {
    type: DataTypes.DECIMAL(10, 2)
  },
  due_date: {
    type: DataTypes.DATEONLY
  },
  status: {
    type: DataTypes.STRING(20)
  }
}, {
  tableName: 'invoices',
  timestamps: false
});

module.exports = Invoice;
