const { Sequelize } = require('sequelize');
const config = require('./config/config.js').development;

// Initialize Sequelize with MySQL
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect
});

const connectSequelize = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);

    }
};

module.exports = { sequelize, connectSequelize };