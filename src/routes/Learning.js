import express from 'express';
import Models from '../db/models';
import Sequelize from '../db/connect';
import {Op} from 'sequelize';
import randWord from '../utils/randWord';
const router = express.Router();
const Words = Models.Words;

router.get('/first_translate', (req, res) => {
  const from = req.query.from || '';
  const raw_query = `
    SELECT w.*
    FROM translatings as t
    INNER JOIN words as w 
    ON w.id =  t.id_translate_word OR w.id = t.id_word
    WHERE (t.id_language = ${from} AND w.id_language = ${from})
  `;
  Sequelize.query(raw_query, {
    type: Sequelize.QueryTypes.SELECT
  }).then(words => {
    res.send(200, {
      first: randWord(words)
    });
  });
});

router.post('/check_translate', (req, res) => {
  const from = req.query.from || '';
  const to = req.query.to || '';
  const word = req.query.word || '';
  const translate = req.query.translate.toLowerCase() || '';

  const raw_query = `
    SELECT nw.word as native_word, 
    tw.word as translated_word
    FROM translatings as t
    INNER JOIN words as nw 
    ON nw.id =  t.id_word
    INNER JOIN languages as nl
    ON t.id_language = nl.id
    INNER JOIN (
    SELECT w.id as id, w.word, l.id as id_language
    FROM words as w INNER JOIN languages as l 
    ON w.id_language = l.id) as tw
    ON tw.id = t.id_translate_word
    WHERE (nw.id = ${word} OR tw.id = ${word}) 
    AND (nl.id = ${from} OR tw.id_language = ${from})
    AND (nl.id = ${to} OR tw.id_language = ${to})
  `;

  Sequelize.query(raw_query, {
      type: Sequelize.QueryTypes.SELECT
  }).then(words => {
    Words.findOne({where: {id: word}}).then(word => {
      const native_word = words[0].native_word !== word.word
        ? words[0].native_word.toLowerCase()
        : words[0].translated_word.toLowerCase();
      const reg = new RegExp(`^${translate}`);

      if(native_word === translate){
        const notInCondition = {
          attributes: ['id', 'word', 'meaning'],
          where: {
            id: {
              [Op.notIn]: req.body.words
            }
          }
        };

        Words.findAll(notInCondition).then(words => {
          res.send(200, {
            success: true,
            next: randWord(words)
          });
        });
      } else
        res.send(200, {
          success: false,
          checked: reg.test(native_word)
        });
    });

  });
});

export default router;