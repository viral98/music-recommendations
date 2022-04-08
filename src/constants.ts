// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const SPOTIFY_PLAYLIST_TO_SONG_URL = (playlist_id:string) =>  `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`
export const DUMMY_PLAYLIST_ID = [ "71iE0glGv95pmqMhZ7fYU1","7ejRmPjqrpqO2jvCV7uUYr", "3I3Rum9Ttri7P12GQEeD5A", "2OTSem2wmVR2MA4Dtq6RTC", "37i9dQZF1DWTwzVdyRpXm1"]
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