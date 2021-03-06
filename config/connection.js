const Sequelize = require('sequelize');

require('dotenv').config();

// create connection to db
const sequelize = process.env.JAWSDB_URL
    // if
    ? new Sequelize(process.env.JAWSDB_URL)
    // else
    : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306,
        freezeTableName: true
    });

module.exports = sequelize;