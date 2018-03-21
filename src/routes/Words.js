import express from 'express';
import Models from '../db/models';
import {Op} from 'sequelize';
import Sequelize from '../db/connect';
const router = express.Router();
const Languages = Models.Languages;
const Words = Models.Words;
const Translating = Models.Translating;


router.post('/words', (req, res) => {
  Words.findOrCreate({
    where: {
      word: req.body.word,
      id_language: req.body.id_language
    }
  }).spread((word, created) => {
    res.send(201, word);
  });
});

router.get('/words', (req, res) => {
  const search = req.query.search || '';
  const language = req.query.language || '';

  const searchCondition = {
    word: {
      [Op.like]: `${search}%`
    }, ...(language === '' ? {} : {
      id_language: language
    })
  };

  Words.findAll({
    where: searchCondition,
    attributes: ['id', 'word', 'meaning'],
    include: [{
      model: Languages,
      attributes: ['language']
    }]
  }).then(words => {
    const result = words.map(word => ({
        ...word.dataValues,
        language: word.language.language
    }));

    res.send(200, result);
  });
});

router.get('/words/:id', (req, res) => {
  Words.findOne({
    where: {id: req.params.id}
  }).then(word => {
    res.send(200, word);
  });
});

router.delete('/words/:id', (req, res) => {
  const findByID = { where: {id: req.params.id} };

  Words.findOne(findByID).then(word => {
    Words.destroy(findByID);
    res.send(200, word);
  });
});

router.put('/words/:id', (req, res) => {
  const findByID = { where: {id: req.params.id} };

  Words.update(req.body,findByID);
  Words.findOne(findByID).then(word => {
    res.send(200, word);
  });
});

router.post('/translation', (req, res) => {
  const native = req.body.native_word || '';
  const translated = req.body.translated_word || '';

  Words.findOne({where: {id: native}}).then(word => {
    Translating.create({
      id_word: native,
      id_language: word.id_language,
      id_translate_word: translated
    }).then(translate => {
      res.send(201, translate);
    });
  });

});

router.get('/translations', (req, res) => {
  const search = req.query.search || '';
  const language = req.query.language || '';

  const searchCondition = {
    where: {
      word: {
        [Op.like]: `${search}%`
      }, ...(language === '' ? {} : {
        id_language: language
      })
    }
  };

  const raw_query = `
    SELECT t.id as id,
    nw.word as native_word, 
    nl.language as native_language, 
    tw.word as translated_word, 
    tw.language as translated_language
    FROM translatings as t
    INNER JOIN words as nw 
    ON nw.id =  t.id_word
    INNER JOIN languages as nl
    ON t.id_language = nl.id
    INNER JOIN (
    SELECT w.id, w.word, l.language 
    FROM words as w INNER JOIN languages as l 
    ON w.id_language = l.id) as tw
    ON tw.id = t.id_translate_word
  `;

  Sequelize.query(
    raw_query, {
    type: Sequelize.QueryTypes.SELECT
  }).then(translations => {
    res.send(200, translations);
  });
});

export default router;