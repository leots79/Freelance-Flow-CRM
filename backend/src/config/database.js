const { Sequelize } = require('sequelize');
const path = require('path');

const databasePath = path.join(
    __dirname,
    '../../database.sqlite'
);

const sequelize = new Sequelize({
    dialect: 'sqlite',

    storage: databasePath,

    logging: false,

    define: {
        timestamps: true,
        freezeTableName: true
    }
});

module.exports = sequelize;