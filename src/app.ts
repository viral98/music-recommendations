import express from 'express';
import { collaborativeFilter, InputMatrix } from './cf';
import { FetchSongs } from './fetchSongs';
import { SpotifyWebApi } from 'spotify-web-api-ts';
import { DUMMY_PLAYLIST_ID, SPOTIFY_TOKEN } from './constants';
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    const spotify = new SpotifyWebApi({ accessToken: SPOTIFY_TOKEN });
    
    const asyncFunc = async () => {
      const songData: InputMatrix = [];

      await Promise.all(DUMMY_PLAYLIST_ID.map(async (playlist_id) =>{
        songData.push(await FetchSongs(spotify, playlist_id))
        return songData
      }))

      return songData
    }
     
    let songData = await asyncFunc();
    
    songData =  songData.filter(function( element ) {
      return element !== undefined;
   });
  
    const result = collaborativeFilter(songData, songData.length -1);
    const asyncFuncPlayListData = async () => {
      const playListData = await Promise.all(DUMMY_PLAYLIST_ID.map(async (playlist_id) =>{
        return  await spotify.playlists.getPlaylist(playlist_id)
      }))
      return playListData
    }

    const playListData =  (await asyncFuncPlayListData())

    let overAllIndex =0
    

    const commonLikings =  playListData.map((playlist, index) =>{
      playlist.tracks.items.map((e) => {
        overAllIndex++;
        return e.track.name
      }).filter((value, index) => result.includes(overAllIndex))
    })
     
    res.send(commonLikings);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});