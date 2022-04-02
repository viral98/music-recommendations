import express from 'express';
import { collaborativeFilter } from './cf';
import { fetchPlayListSongData } from './fetchSongs';
import { SpotifyWebApi } from 'spotify-web-api-ts';
import { DUMMY_PLAYLIST_ID, SPOTIFY_TOKEN } from './constants';
import { fetchPlaylists } from './fetchPlaylists';
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const spotify = new SpotifyWebApi({ accessToken: SPOTIFY_TOKEN });
  const songData = await fetchPlaylists(spotify, DUMMY_PLAYLIST_ID);
  const result = collaborativeFilter(songData, 1 );
  console.log(result)
  const playListData = await spotify.playlists.getPlaylist(DUMMY_PLAYLIST_ID[0]);
  const commonLikings = playListData.tracks.items.map((e) => e.track.name).filter((value, index) => result.includes(index))
  res.send(commonLikings);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});