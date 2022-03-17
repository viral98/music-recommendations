import express from 'express';
import { collaborativeFilter } from './cf';
import { FetchSongs } from './fetchSongs';
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    const songData = await FetchSongs()
    const result = collaborativeFilter(songData, 2);
    res.send(result);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});