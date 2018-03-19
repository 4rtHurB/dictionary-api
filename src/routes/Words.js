import express from 'express';
import Words from '../db/models/Words';
const router = express.Router();

router.post('/words', (req, res) => {
  Words.findOrCreate({
    where: {word: req.body.word}
  }).spread((word, created) => {
    res.send(201, word);
  });
});

router.get('/words', (req, res) => {
  Words.findAll().then(words => {
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

export default router;