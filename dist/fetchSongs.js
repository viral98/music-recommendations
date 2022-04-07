"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNewRecommendations = exports.FetchSongs = exports.attributesMap = void 0;
const constants_1 = require("./constants");
const axios = require('axios');
let playlistData;
exports.attributesMap = {
    "0": {
        "attribute": "danceability",
        "ulimit": 0.3,
        "llimit": 0,
        "desc": "No Dance"
    },
    "1": {
        "attribute": "danceability",
        "ulimit": 0.5,
        "llimit": 0.3,
        "desc": "Slow Panced Dance"
    },
    "2": {
        "attribute": "danceability",
        "ulimit": 0.7,
        "llimit": 0.5,
        "desc": "High Paced Dance"
    },
    "3": {
        "attribute": "danceability",
        "ulimit": 0.7,
        "llimit": 1,
        "desc": "EDM"
    },
    "4": {
        "attribute": "energy",
        "ulimit": 0.3,
        "llimit": 0,
        "desc": "Calm Energy"
    },
    "5": {
        "attribute": "energy",
        "ulimit": 0.5,
        "llimit": 0.3,
        "desc": "Med-low Energy"
    },
    "6": {
        "attribute": "energy",
        "ulimit": 0.5,
        "llimit": 0.7,
        "desc": "Med-high Energy"
    },
    "7": {
        "attribute": "energy",
        "ulimit": 0.7,
        "llimit": 1,
        "desc": "High Energy"
    },
    "8": {
        "attribute": "instrumentalness",
        "ulimit": 0.3,
        "llimit": 0,
        "desc": "Less Instrumental"
    },
    "9": {
        "attribute": "instrumentalness",
        "ulimit": 0.5,
        "llimit": 0.3,
        "desc": "Medium Instrumental"
    },
    "10": {
        "attribute": "instrumentalness",
        "ulimit": 0.5,
        "llimit": 0.7,
        "desc": "Medium-high Instrumental"
    },
    "11": {
        "attribute": "instrumentalness",
        "ulimit": 0.7,
        "llimit": 1,
        "desc": "Very Instrumental"
    },
    "12": {
        "attribute": "speechiness",
        "ulimit": 0.3,
        "llimit": 0,
        "desc": "Maybe Instrumental"
    },
    "13": {
        "attribute": "speechiness",
        "ulimit": 0.5,
        "llimit": 0.3,
        "desc": "Few Words"
    },
    "14": {
        "attribute": "speechiness",
        "ulimit": 0.5,
        "llimit": 0.7,
        "desc": "Lots Of Words"
    },
    "15": {
        "attribute": "speechiness",
        "ulimit": 0.7,
        "llimit": 1,
        "desc": "Rap"
    },
    "16": {
        "attribute": "valence",
        "ulimit": -0.5,
        "llimit": -1,
        "desc": "Angry"
    },
    "17": {
        "attribute": "valence",
        "ulimit": 0,
        "llimit": -0.5,
        "desc": "Depressed"
    },
    "18": {
        "attribute": "valence",
        "ulimit": 0.5,
        "llimit": 0,
        "desc": "Sad"
    },
    "19": {
        "attribute": "valence",
        "ulimit": 1,
        "llimit": 0.5,
        "desc": "Euphoric"
    }
};
function FetchSongs(spotify) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield spotify.playlists.getPlaylist(constants_1.DUMMY_PLAYLIST_ID);
        playlistData = result;
        const songData = yield spotify.tracks.getAudioFeaturesForTracks(result.tracks.items.map((e) => e.track.id));
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
        const resultantMatrix = songData.map((e) => ([
            Number(e.danceability <= 0.3),
            Number(e.danceability > 0.3 && e.danceability <= 0.5),
            Number(e.danceability > 0.5 && e.danceability <= 0.7),
            Number(e.danceability > 0.7),
            Number(e.energy <= 0.3),
            Number(e.energy > 0.3 && e.energy <= 0.5),
            Number(e.energy > 0.5 && e.energy <= 0.7),
            Number(e.energy > 0.7),
            Number(e.instrumentalness <= 0.3),
            Number(e.instrumentalness > 0.3 && e.instrumentalness <= 0.5),
            Number(e.instrumentalness > 0.5 && e.instrumentalness <= 0.7),
            Number(e.instrumentalness > 0.7),
            Number(e.speechiness <= 0.3),
            Number(e.speechiness > 0.3 && e.speechiness <= 0.5),
            Number(e.speechiness > 0.5 && e.speechiness <= 0.7),
            Number(e.speechiness > 0.7),
            Number(e.valence <= 0.3),
            Number(e.valence > 0.3 && e.valence <= 0.5),
            Number(e.valence > 0.5 && e.valence <= 0.7),
            Number(e.valence > 0.7)
        ] // Euphoric
        ));
        return resultantMatrix;
    });
}
exports.FetchSongs = FetchSongs;
function GetNewRecommendations(likingMatrix) {
    const attributes = evaluateAttributes(likingMatrix);
    let artistData = [];
    let artistSort = {};
    let genreData = {};
    // count ocuurence of each artist + genre from EACH song
    for (const song in playlistData.tracks.items) {
        let index = playlistData.tracks.items[song].track.artists[0].name;
        index = `${index}`;
        artistSort[index] = (typeof artistSort[index] === 'undefined') ? 1 : artistSort[index] + 1;
        artistData[index] =
            (typeof artistData[index] === 'undefined') ?
                { 'name': `${index}`, 'id': playlistData.tracks.items[song].track.artists[0].id, 'count': 1 } :
                { 'name': `${index}`, 'id': playlistData.tracks.items[song].track.artists[0].id, 'count': artistData[index].count + 1 };
    }
    artistSort = Object.fromEntries(Object.entries(artistSort).sort(([, v1], [, v2]) => +v2 - +v1));
    // console.log(artistSort);
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SPOTIFY_KEY}`
        }
    };
    axios.get(`https://api.spotify.com/v1/artists/${artistData[Object.keys(artistSort)[0]].id}`, config)
        .catch(function (error) {
        if (error.response) {
            // Request made and server responded
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }
        else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
        }
        else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
    })
        .then(res => {
        genreData = res.data.genres;
        // console.log(genreData);
        generateRecommendatins(genreData, artistData[Object.keys(artistSort)[0]], attributes);
    });
}
exports.GetNewRecommendations = GetNewRecommendations;
function generateRecommendatins(genre, artist, attributes) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SPOTIFY_KEY}`
            }
        };
        // feed genre
        let genres = "";
        for (let k = 0; k < 2 && k < genre.length; k++) {
            genre[k] = genre[k].split(' ').join('+');
            if (genres.length === 0)
                genres = genre[k];
            else
                genres = genres + "%2C" + genre[k];
        }
        console.log(genres);
        console.log(artist);
        // attributes from CF
        const targetAttributes = `target_danceability=${attributes.danceability}&target_energ=${attributes.energy}` +
            `target_instrumentalness=${attributes.instrumentalness}&target_speechiness=${attributes.speechiness}` +
            `target_valence=${attributes.valence}`;
        axios.get(`https://api.spotify.com/v1/recommendations?seed_tracks=${constants_1.DUMMY_PLAYLIST_ID}&seed_genres=${genres}&seed_artist=${artist.id}&limit=5&}`, config)
            .catch(function (error) {
            if (error.response) {
                // Request made and server responded
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
            else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            }
            else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        })
            .then(res => {
            // console.log(res.data);
            // console.log(res.data.tracks);
            for (const song of res.data.tracks) {
                console.log(song.name + ", " + song.artists[0].name);
            }
        });
    });
}
// Method to calculate attribute vallues based on CF calculations.
function evaluateAttributes(likingMatrix) {
    let attributes = {
        'danceability': 0,
        'energy': 0,
        'instrumentalness': 0,
        'speechiness': 0,
        'valence': 0
    };
    // console.log(likingMatrix); // works
    // evaluate attributes here, find best vallues for 5 attrs.
    for (const val of likingMatrix) {
        let attributeNumber = Math.floor(val / 4);
        if (attributeNumber === 0) {
            if (attributes.danceability === 0) {
                attributes.danceability = Number((exports.attributesMap[val].ulimit - exports.attributesMap[val].llimit / 2).toFixed(2));
            }
        }
        if (attributeNumber === 1) {
            if (attributes.energy === 0) {
                attributes.energy = Number((exports.attributesMap[val].ulimit - exports.attributesMap[val].llimit / 2).toFixed(2));
            }
        }
        if (attributeNumber === 2) {
            if (attributes.instrumentalness === 0) {
                attributes.instrumentalness = Number((exports.attributesMap[val].ulimit - exports.attributesMap[val].llimit / 2).toFixed(2));
            }
        }
        if (attributeNumber === 3) {
            if (attributes.speechiness === 0) {
                attributes.speechiness = Number((exports.attributesMap[val].ulimit - exports.attributesMap[val].llimit / 2).toFixed(2));
            }
        }
        if (attributeNumber === 4) {
            if (attributes.valence === 0) {
                attributes.valence = Number((exports.attributesMap[val].ulimit - exports.attributesMap[val].llimit / 2).toFixed(2));
            }
        }
    }
    console.log("attributes generated are: ");
    console.log(attributes);
    // return 5 attributes as an array.
    return attributes;
}
// https://open.spotify.com/playlist/37i9dQZF1DXbck8sFsEQGj?si=a43a4222cc1a413a // indian geres
// https://open.spotify.com/playlist/37i9dQZF1E38GzV4rvBzBp?si=6ce668edd3814a8f Daily playlist 1
// https://open.spotify.com/playlist/37i9dQZF1DX4fpCWaHOned?si=a1d4b4ea0d2a48cf Uplifting Playlist
// https://open.spotify.com/playlist/37i9dQZF1DX4OzrY981I1W?si=c0bf37d19c1640cb // movie playlist -> art pop and dance pop error
// https://open.spotify.com/playlist/37i9dQZF1DWViBxWcYEI1b?si=3eb9da6a28dd4beb Conntemporary 
// https://open.spotify.com/playlist/37i9dQZF1DX0vHZ8elq0UK?si=14302cb4e4294858 energetic playlist
//# sourceMappingURL=fetchSongs.js.map