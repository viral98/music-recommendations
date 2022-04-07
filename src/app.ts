import express from 'express';
import { collaborativeFilter } from './cf';
import { SpotifyWebApi } from 'spotify-web-api-ts';
import { DUMMY_PLAYLIST_ID, SPOTIFY_TOKEN } from './constants';
import { fetchPlaylists } from './fetchPlaylists';
const similarity = require( 'compute-cosine-similarity' );

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const spotify = new SpotifyWebApi({ accessToken: SPOTIFY_TOKEN });
  const songData = await fetchPlaylists(spotify, DUMMY_PLAYLIST_ID);
  console.log(songData[songData.length -1])
  const result = collaborativeFilter(songData, songData.length - 1 );
  // console.log(result)
  // const playListData = await spotify.playlists.getPlaylist(DUMMY_PLAYLIST_ID[0]);
  // const commonLikings = playListData.tracks.items.map((e) => e.track.name).filter((value, index) => result.includes(index))
  res.send(result);
  const listOfRecommendationsWithAttributes = (
    Array.from(
      { length: 10 },
      () => Array.from(
        { length: 20 },
        () => parseFloat((Math.random()).toFixed(4))
      )
    )
  );
  let cosineSimilaritiesOfAllReccomendations = 0;
  for (let i = 0; i < 10; i++) {
    for (let j = i + 1; j < 10; j++) {
      if (j == 10) continue;
      cosineSimilaritiesOfAllReccomendations += similarity(
        listOfRecommendationsWithAttributes[i],
        listOfRecommendationsWithAttributes[j]
      );
    }
  }
  const averageCosineSimilarity = cosineSimilaritiesOfAllReccomendations / 45;
  console.log(`Intra-list similarity is ${averageCosineSimilarity}`);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
