import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import wordsRouter from './routes/Words';
import enableCORS from './middleware/cors';

dotenv.load();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('combined'));
app.use(enableCORS);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', wordsRouter);

app.get('*', (req, res) => {
  res.send(200, 'Hello from Dictionary-API');
});

app.listen(PORT , () => {
  console.log('Dictionary-API listening on port ' + PORT);
});

export default app;
