import { SpotifyWebApi } from 'spotify-web-api-ts';
import { InputMatrix } from './cf';

import { DUMMY_PLAYLIST_ID } from "./constants"


export async function FetchSongs(spotify: SpotifyWebApi){

  const result = await spotify.playlists.getPlaylist(DUMMY_PLAYLIST_ID);

  
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
  const resultantMatrix:InputMatrix = songData.map((e)=>(
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
      Number(e.valence <= -0.5), // Depressed, Angry
      Number(e.valence > -0.5 && e.valence <= 1), // Sad
      Number(e.valence > 1 && e.valence <= 0.5), // Cheerful
      Number(e.valence > 0.5)] // Euphoric
  ));
  return resultantMatrix;
}