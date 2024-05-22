const dotenv = require('dotenv');
const Sequelize = require('sequelize');

dotenv.config();

const sequelize = new Sequelize(process.env.PG_URI, {dialect: 'postgres'});

module.exports = sequelize;
