import { SpotifyWebApi } from "spotify-web-api-ts/types";
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

  allSongData.push([
    0, 0, 0, 1, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1
  ])
  return allSongData
  
}