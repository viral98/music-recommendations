import { SPOTIFY_PLAYLIST_TO_SONG_URL, DUMMY_PLAYLIST_ID, SPOTIFY_TOKEN } from "./constants"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios')

export async function FetchSongs(){
  
  const result = await axios
  .get(SPOTIFY_PLAYLIST_TO_SONG_URL(DUMMY_PLAYLIST_ID), {
    headers: {
      'Authorization': `Bearer ${SPOTIFY_TOKEN}`
    }
  })
  
  console.log(result)

}