import {DataTypes} from 'sequelize';
import Sequelize from '../connect';

const Languages = Sequelize.define('languages', {
  language: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  }
});

export default Languages;