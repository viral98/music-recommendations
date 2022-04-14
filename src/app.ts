import express from 'express';
import { collaborativeFilter } from './cf';
import { GetNewRecommendations, getRecomFeatures } from './fetchSongs';

import { SpotifyWebApi } from 'spotify-web-api-ts';
import { DUMMY_PLAYLIST_ID, BLEND_PLAYLIST_ID, SPOTIFY_TOKEN } from './constants';
import { fetchPlaylists } from './fetchPlaylists';

import { getCosineSimilarities, getInterCosineSimilarities } from './getCosineSimilarities';
import { getRandomListOfRecommendations } from './getRandomListOfRecommendations';

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const spotify = new SpotifyWebApi({ accessToken: SPOTIFY_TOKEN });
  const songData = await fetchPlaylists(spotify, DUMMY_PLAYLIST_ID);
  // console.log(songData[songData.length -1])
  const result = collaborativeFilter(songData, songData.length - 1 );

  const recommendationData = await GetNewRecommendations(result);
  const recomMatrix = await getRecomFeatures(spotify, recommendationData);

  // console.log("Recomm Matrix is: ");
  // console.log(recomMatrix);

  console.log(`\nIntra-list similarity is: ${getCosineSimilarities(recomMatrix).toFixed(5)}`);

  // Test to compare with Spotify Blend generated list
  const blendMatrix = await fetchPlaylists(spotify, BLEND_PLAYLIST_ID);
  console.log(`\nInter-List similarity (Spotify-Generated Blend Playlist) is: ${getInterCosineSimilarities(recomMatrix, blendMatrix).toFixed(5)}`);

  // console.log(`\nIntra-list similarity for Blend Matrix is: ${getCosineSimilarities(blendMatrix).toFixed(5)}`);

  res.send(result);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});