// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const SPOTIFY_PLAYLIST_TO_SONG_URL = (playlist_id:string) =>  `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`
export const DUMMY_PLAYLIST_ID = "37i9dQZF1E38GzV4rvBzBp"
export const SPOTIFY_TOKEN = process.env.SPOTIFY_KEY