import express from 'express';
import { collaborativeFilter } from './cf';
import { SpotifyWebApi } from 'spotify-web-api-ts';
import { DUMMY_PLAYLIST_ID, SPOTIFY_TOKEN } from './constants';
import { fetchPlaylists } from './fetchPlaylists';
import { getCosineSimilarities } from './getCosineSimilarities';
import { getRandomListOfRecommendations } from './getRandomListOfRecommendations';

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const spotify = new SpotifyWebApi({ accessToken: SPOTIFY_TOKEN });
  const songData = await fetchPlaylists(spotify, DUMMY_PLAYLIST_ID);
  console.log(songData[songData.length -1])
  const result = collaborativeFilter(songData, songData.length - 1 );
  console.log(`Intra-list similarity is ${getCosineSimilarities(getRandomListOfRecommendations())}`);
  res.send(result);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
