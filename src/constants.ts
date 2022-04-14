// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const SPOTIFY_PLAYLIST_TO_SONG_URL = (playlist_id:string) =>  `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`
export const DUMMY_PLAYLIST_ID = ["37i9dQZF1E38GzV4rvBzBp", "4E5a8jO5lkzKJebOXeLUhC"]
export const BLEND_PLAYLIST_ID = ["4E5a8jO5lkzKJebOXeLUhC"]
export const SPOTIFY_TOKEN = process.env.SPOTIFY_KEY
export const HIGH_ENERGY_HIGH_DANCEABILITY_MOOD = [
  0, 0, 0, 1, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 1
]

export const LOFI_MOOD = [
  0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 1, 0, 0, 1,
  0, 0, 0, 0, 0, 0
]

// pop https://open.spotify.com/playlist/37i9dQZF1DXarRysLJmuju?si=f09ee0c7a00a4cfb
// kevin 4E5a8jO5lkzKJebOXeLUhC