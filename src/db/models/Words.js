import {DataTypes} from 'sequelize';
import Sequelize from '../connect';

const Words = Sequelize.define('words', {
  word: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  meaning: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

export default Words;