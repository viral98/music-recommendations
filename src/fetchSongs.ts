import { SpotifyWebApi } from 'spotify-web-api-ts';
import { attributesMap, DUMMY_PLAYLIST_ID } from "./constants"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');

const playlistData = [];



export async function fetchPlayListSongData(spotify: SpotifyWebApi , playlist_id: string):Promise<number[][]> {
  const result = await spotify.playlists.getPlaylist(playlist_id);
  result.tracks.items.forEach((item) => playlistData.push(item))

  const songData = await spotify.tracks.getAudioFeaturesForTracks(
    result.tracks.items.map((e) =>  e.track.id));
  // Taking into consideration the following features from songs:
  // 1. Danceability: Derived from combination of musical elements such as
  //                  tempo, rhythm stability, beat strength, and overall
  //                  regularity. Note that other selected features do not need
  //                  to be musical elements since danceability score is derived
  //                  from them. (Range: 0 - 1)
  // 2. Energy: Perceptual features contributing to this attribute include
  //            dynamic range, perceived loudness, timbre, onset rate, and
  //            general entropy. (Range: 0 - 1)
  // 3. Instrumentalness: Score predicting absence of vocals. (Range: 0 - 1)
  // 4. Speechiness: Speechiness detects the presence of spoken words in a track.
  //                 (Range: 0 - 1)
  // 5. Valence: Positiveness conveyed in the track. Higher values indicate the
  //             track is happy, cheerful, euphoric while lower values indicate
  //             the track is negative e.g. sad, depressed, angry.
  // Features are modelled such that each value in the 0-1 input matrix represents
  // a custom defined range for these features. Feature values are normalized and
  // represented in this manner because the CF implementation only accepts a 0-1
  // matrix -- the raw feature values usually have a range associated. Note that
  // some of the selected attributes are either intentionally complementary or
  // have similarities, this is to surface outliers and allow for an unbiased
  // representation.
  //
  // See https://developer.spotify.com/documentation/web-api/reference/#/operations/get-several-audio-features
  const resultantMatrix:number[][] = generateBinnedMatrix(songData);

  return resultantMatrix;
}

export async function getRecomFeatures(spotify: SpotifyWebApi, recomSongData) {
  const recomFeatures = await spotify.tracks.getAudioFeaturesForTracks(
    recomSongData.map((e) => e.id));
    const recomMatrix = generateBinnedMatrix(recomFeatures);
    return recomMatrix;
}

export async function GetNewRecommendations(likingMatrix) {
  const attributes = evaluateAttributes(likingMatrix);

  const artistData = [];
  let artistSort = {};
  let genreData = {};

  // count ocuurence of each artist + genre from EACH song
  for (const song in playlistData) {
    let index = playlistData[song].track.artists[0].name;
    index = `${index}`;
    artistSort[index] = (typeof artistSort[index] === 'undefined')? 1 : artistSort[index] + 1;
    artistData[index] = 
      (typeof artistData[index] === 'undefined')? 
        {'name' : `${index}`, 'id' : playlistData[song].track.artists[0].id, 'count' : 1 } : 
        {'name' : `${index}`, 'id' : playlistData[song].track.artists[0].id, 'count' : artistData[index].count + 1};
  }


  artistSort = Object.entries(artistData).sort(function(a, b){
    return b[1].count - a[1].count;
  });

  const config = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SPOTIFY_KEY}`
    }
  }

  const data = await axios.get(`https://api.spotify.com/v1/artists/${artistSort[0][1].id}`, config)
    .catch(function (error) {
     console.error(error)
    })
    .then(async res => {
      genreData = res.data.genres;
      const data = await generateRecommendatins(genreData, artistSort[0][1], attributes);
      return data;
    })  
    return data;
}

async function generateRecommendatins(genre, artist, attributes) {

  // feed genre
  let genres = "";
  for (let k = 0; k < 2 && k < genre.length; k++) {
    genre[k] = genre[k].split(' ').join('+');
    if (genres.length === 0) genres = genre[k];
    else if(genre[k] != "dance+pop" ) genres + "%2C" + genre[k];
  }
  
  if(genres == "dance+pop"){
    genres = "pop%2Cdance"
  }

  console.log("genres: " + genres);
  console.log("artist: ");
  console.log(artist);

  // attributes from CF
  const targetAttributes = `target_danceability=${attributes.danceability}&target_energy=${attributes.energy}` +
  `&target_instrumentalness=${attributes.instrumentalness}&target_speechiness=${attributes.speechiness}` +
    `&target_valence=${attributes.valence}`;
  const data =  await spotifyCall(DUMMY_PLAYLIST_ID, genres, artist.id, targetAttributes);
  
  return data;
}

async function spotifyCall(playlistId, genres, artistId, targetAttributes) { // rename function
  const config = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SPOTIFY_KEY}`
    }
  }
  const axiosGet = `https://api.spotify.com/v1/recommendations?seed_tracks=${playlistId[0]}&seed_genres=${genres}&seed_artist=${artistId}&${targetAttributes}&limit=5`

  const recomms = await axios.get(axiosGet, config)
  .catch(function (error) {
    console.error(error)
  })
  .then(res => {
    
    return res.data.tracks;
  })
  
  return recomms;
}

// Method to calculate attribute vallues based on CF calculations.
function evaluateAttributes(likingMatrix) {
  const attributes = {
    'danceability' : 0,
    'energy' : 0,
    'instrumentalness' : 0,
    'speechiness' : 0,
    'valence' : 0
  }

  // console.log(likingMatrix); // works

  // evaluate attributes here, find best vallues for 5 attrs.
  for (const val of likingMatrix) {
    const attributeNumber = Math.floor(val/4);
    if (attributeNumber === 0) {
      if (attributes.danceability === 0) {
        attributes.danceability = Number((attributesMap[val].ulimit - attributesMap[val].llimit / 2).toFixed(2));
      }
    }    if (attributeNumber === 1) {
      if (attributes.energy === 0) {
        attributes.energy = Number((attributesMap[val].ulimit - attributesMap[val].llimit / 2).toFixed(2));
      }
    }    if (attributeNumber === 2) {
      if (attributes.instrumentalness === 0) {
        attributes.instrumentalness = Number((attributesMap[val].ulimit - attributesMap[val].llimit / 2).toFixed(2));
      }
    }    if (attributeNumber === 3) {
      if (attributes.speechiness === 0) {
        attributes.speechiness = Number((attributesMap[val].ulimit - attributesMap[val].llimit / 2).toFixed(2));
      }
    }    if (attributeNumber === 4) {
      if (attributes.valence === 0) {
        attributes.valence = Number((attributesMap[val].ulimit - attributesMap[val].llimit / 2).toFixed(2));
      }
    }
  }

  return attributes;
}

function generateBinnedMatrix(songData) {
  const result = songData.map((e)=>(
    [
      Number(e.danceability <= 0.3), // Can't dance
      Number(e.danceability > 0.3 && e.danceability <= 0.5), // Slow paced dance
      Number(e.danceability > 0.5 && e.danceability <= 0.7), // Medium - high paced dance
      Number(e.danceability > 0.7), // EDM etc.
      Number(e.energy <= 0.3), // Calming, low energy
      Number(e.energy > 0.3 && e.energy <= 0.5), // Medium-low
      Number(e.energy > 0.5 && e.energy <= 0.7), // Medium-high
      Number(e.energy > 0.7), // High energy
      Number(e.instrumentalness <= 0.3), //  Maybe rap music or too wordy
      Number(e.instrumentalness > 0.3 && e.instrumentalness <= 0.5), // Wordy parts interspersed with solo or instrumentals
      Number(e.instrumentalness > 0.5 && e.instrumentalness <= 0.7), // 
      Number(e.instrumentalness > 0.7), // Instrumental music
      Number(e.speechiness <= 0.3), // Maybe instrumental
      Number(e.speechiness > 0.3 && e.speechiness <= 0.5), // Few rap parts
      Number(e.speechiness > 0.5 && e.speechiness <= 0.7), // Lots of spoken words
      Number(e.speechiness > 0.7), // Rap music
      Number(e.valence <= 0.3), // Depressed, Angry
      Number(e.valence > 0.3 && e.valence <= 0.5), // Sad
      Number(e.valence > 0.5 && e.valence <= 0.7), // Cheerful
      Number(e.valence > 0.7)] // Euphoric
  ));
  return result;
}

// https://open.spotify.com/playlist/37i9dQZF1DXbck8sFsEQGj?si=a43a4222cc1a413a // indian geres

// https://open.spotify.com/playlist/37i9dQZF1E38GzV4rvBzBp?si=6ce668edd3814a8f Daily playlist 1 - TS
// https://open.spotify.com/playlist/37i9dQZF1DX4OzrY981I1W?si=c0bf37d19c1640cb // movie playlist -> art pop and dance pop error