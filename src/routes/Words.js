import express from 'express';
import Words from '../db/models/Words';
import {Op} from 'sequelize';
const router = express.Router();

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
    where: {
      word: {
        [Op.like]: `${search}%`
      }, ...(language === '' ? {} : {
        id_language: language
      })
    }
  };

  Words.findAll(searchCondition).then(words => {
    res.send(200, words);
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

router.get('/words/:id', (req, res) => {
  const language = req.query.language || '';
  const translate = req.query.translate || '';
});

export default router;