import express from 'express';
import Models from '../db/models';
import {Op} from 'sequelize';

const router = express.Router();
const Languages = Models.Languages;

router.post('/languages', (req, res) => {
  Languages.findOrCreate({
    where: {language: req.body.language}
  }).spread((language, created) => {
    res.send(201, language);
  });
});

router.get('/languages', (req, res) => {
  const search = req.query.search || '';

  const searchCondition = {
    where: {
      language: {
        [Op.like]: `${search}%`,
      }
    }
  };

  Languages.findAll(searchCondition).then(languages => {
    res.send(200, languages);
  });
});

router.get('/languages/:id', (req, res) => {
  Languages.findOne({
    where: {id: req.params.id}
  }).then(language => {
    res.send(200, language);
  });
});

router.delete('/languages/:id', (req, res) => {
  const findByID = { where: {id: req.params.id} };

  Languages.findOne(findByID).then(language => {
    Languages.destroy(findByID);
    res.send(200, language);
  });
});

router.put('/languages/:id', (req, res) => {
  const findByID = { where: {id: req.params.id} };

  Languages.update(req.body, findByID);
  Languages.findOne(findByID).then(language => {
    res.send(200, language);
  });
});

export default router;