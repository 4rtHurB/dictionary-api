import {DataTypes} from 'sequelize';
import Sequelize from '../connect';

const Translating = Sequelize.define('translating', {
  id_word: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_language: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_translate_word: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
});

export default Translating;