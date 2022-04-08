import { SpotifyWebApi } from "spotify-web-api-ts/types";
import { HIGH_ENERGY_HIGH_DANCEABILITY_MOOD } from "./constants";
import { fetchPlayListSongData } from "./fetchSongs";

export async function fetchPlaylists (spotify: SpotifyWebApi, playlist_ids: string[] ): Promise<number[][]>{
  const songData:number[][] =[];
  const allSongData: number[][] = [];

  const allPlaylistsSongData = await Promise.all(playlist_ids.map(async (playlist_id) => {
    const currentPlaylistData = await fetchPlayListSongData(spotify, playlist_id);

    currentPlaylistData.forEach((value) => {
        songData.push(value);
    }
  )

  return songData;
  }))
  

  allPlaylistsSongData.map((value) => {
      value.map((individalSongData) => {
        allSongData.push(individalSongData);
      })
    }
  )

  allSongData.push(HIGH_ENERGY_HIGH_DANCEABILITY_MOOD)
  return allSongData
  
}