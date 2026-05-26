const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;

// Si existe DATABASE_URL (Render con PostgreSQL), usar PostgreSQL
// Si no, usar SQLite local para desarrollo
if (process.env.DATABASE_URL) {

    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',

        logging: false,

        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },

        define: {
            timestamps: true,
            freezeTableName: true
        }
    });

} else {

    const databasePath = path.join(
        __dirname,
        '../../database.sqlite'
    );

    sequelize = new Sequelize({
        dialect: 'sqlite',

        storage: databasePath,

        logging: false,

        define: {
            timestamps: true,
            freezeTableName: true
        }
    });
}

module.exports = sequelize;