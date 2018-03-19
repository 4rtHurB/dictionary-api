import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';
dotenv.load();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DB_HOSTNAME,
  port: 3306,
});

export default sequelize;