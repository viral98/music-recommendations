import express from 'express';
import { collaborativeFilter } from './cf';
import { FetchSongs } from './fetchSongs';
// import { attributes, GetNewRecommendations } from './fetchSongs';
import { GetNewRecommendations } from './fetchSongs';

import { SpotifyWebApi } from 'spotify-web-api-ts';
import { DUMMY_PLAYLIST_ID, SPOTIFY_TOKEN } from './constants';
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    const spotify = new SpotifyWebApi({ accessToken: SPOTIFY_TOKEN });
    const songData = await FetchSongs(spotify);
    const result = collaborativeFilter(songData, 2);
    const playListData = await spotify.playlists.getPlaylist(DUMMY_PLAYLIST_ID);
    const commonLikings = playListData.tracks.items.map((e) => e.track.name).filter((value, index) => result.includes(index));
    GetNewRecommendations(result);
    res.send(commonLikings);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});