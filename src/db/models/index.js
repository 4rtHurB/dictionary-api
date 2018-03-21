import Words from './Words';
import Languages from './Languages';
import Translating from './Translating';

Languages.hasMany(Words, {foreignKey: 'id_language', sourceKey: 'id'});
Words.belongsTo(Languages, {foreignKey: 'id_language', targetKey: 'id'});

Words.hasMany(Translating, {foreignKey: 'id_word', sourceKey: 'id'});
Translating.belongsTo(Words, {foreignKey: 'id_word', targetKey: 'id'});

Languages.hasMany(Translating, {foreignKey: 'id_language', sourceKey: 'id'});
Translating.belongsTo(Languages, {foreignKey: 'id_language', targetKey: 'id'});

export default {
  Words,
  Languages,
  Translating
};