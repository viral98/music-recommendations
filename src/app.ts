import express from 'express';
import { collaborativeFilter } from './cf';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    const ratings = [
        [1, 1, 1],
        [1, 0, 1],
        [1, 0, 0],
       ];
    const result = collaborativeFilter(ratings, 2);

  res.send(result);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});