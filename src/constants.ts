// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const SPOTIFY_PLAYLIST_TO_SONG_URL = (playlist_id:string) =>  `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`
export const DUMMY_PLAYLIST_ID = ["37i9dQZF1E38GzV4rvBzBp" , "6nNeC7I8bCV3WDSepf06wS"]
export const BLEND_PLAYLIST_ID = ["2NSnRWTFFsXv1XH0OQfdh9"]
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

export const attributesMap = {
  "0": {
    "attribute" : "danceability",
    "ulimit" : 0.3,
    "llimit" : 0,
    "desc" : "No Dance"
  },
  "1" : {
    "attribute" : "danceability",
    "ulimit" : 0.5,
    "llimit" : 0.3,
    "desc" : "Slow Panced Dance"
  },
  "2" : {
    "attribute" : "danceability",
    "ulimit" : 0.7,
    "llimit" : 0.5,
    "desc" : "High Paced Dance"
  },
  "3" : {
    "attribute" : "danceability",
    "ulimit" : 0.7,
    "llimit" : 1,
    "desc" : "EDM"
  },
  "4" : {
    "attribute" : "energy",
    "ulimit" : 0.3,
    "llimit" : 0,
    "desc" : "Calm Energy"
  },
  "5" : {
    "attribute" : "energy",
    "ulimit" : 0.5,
    "llimit" : 0.3,
    "desc" : "Med-low Energy"
  },
  "6" : {
    "attribute" : "energy",
    "ulimit" : 0.5,
    "llimit" : 0.7,
    "desc" : "Med-high Energy"
  },
  "7" : {
    "attribute" : "energy",
    "ulimit" : 0.7,
    "llimit" : 1,
    "desc" : "High Energy"
  },
  "8" : {
    "attribute" : "instrumentalness",
    "ulimit" : 0.3,
    "llimit" : 0,
    "desc" : "Less Instrumental"
  },
  "9" : {
    "attribute" : "instrumentalness",
    "ulimit" : 0.5,
    "llimit" : 0.3,
    "desc" : "Medium Instrumental"
  },
  "10" : {
    "attribute" : "instrumentalness",
    "ulimit" : 0.5,
    "llimit" : 0.7,
    "desc" : "Medium-high Instrumental"
    
  },
  "11" : {
    "attribute" : "instrumentalness",
    "ulimit" : 0.7,
    "llimit" : 1,
    "desc" : "Very Instrumental"
  },
  "12" : {
    "attribute" : "speechiness",
    "ulimit" : 0.3,
    "llimit" : 0,
    "desc" : "Maybe Instrumental"
  },
  "13" : {
    "attribute" : "speechiness",
    "ulimit" : 0.5,
    "llimit" : 0.3,
    "desc" : "Few Words"
  },
  "14" : {
    "attribute" : "speechiness",
    "ulimit" : 0.5,
    "llimit" : 0.7,
    "desc" : "Lots Of Words"
  },
  "15" : {
    "attribute" : "speechiness",
    "ulimit" : 0.7,
    "llimit" : 1,
    "desc" : "Rap"
  },
  "16" : {
    "attribute" : "valence",
    "ulimit" : -0.5,
    "llimit" : -1,
    "desc" : "Angry"
  },
  "17" : {
    "attribute" : "valence",
    "ulimit" : 0,
    "llimit" : -0.5,
    "desc" : "Depressed"
  },
  "18" : {
    "attribute" : "valence",
    "ulimit" : 0.5,
    "llimit" : 0,
    "desc" : "Sad"
  },
  "19" : {
    "attribute" : "valence",
    "ulimit" : 1,
    "llimit" : 0.5,
    "desc" : "Euphoric"
  }
}
// pop https://open.spotify.com/playlist/37i9dQZF1DXarRysLJmuju?si=f09ee0c7a00a4cfb
// kevin 4E5a8jO5lkzKJebOXeLUhC