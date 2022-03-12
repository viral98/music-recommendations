import { SpotifyWebApi } from 'spotify-web-api-ts';
import { InputMatrix } from './cf';

import { SPOTIFY_PLAYLIST_TO_SONG_URL, DUMMY_PLAYLIST_ID, SPOTIFY_TOKEN } from "./constants"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios')

export async function FetchSongs(){
  
  const spotify = new SpotifyWebApi({ accessToken: SPOTIFY_TOKEN });

  const result = await spotify.playlists.getPlaylist(DUMMY_PLAYLIST_ID);

  
  const songData = await spotify.tracks.getAudioFeaturesForTracks(result.tracks.items.map((e) =>  e.track.id))
  const resultantMatrix:InputMatrix = songData.map((e)=>(
    [e.acousticness, e.tempo, e.energy, e.liveness, e.loudness, e.speechiness]
  ))
  return resultantMatrix
}