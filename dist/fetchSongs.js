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
exports.FetchSongs = void 0;
const spotify_web_api_ts_1 = require("spotify-web-api-ts");
const constants_1 = require("./constants");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');
const raccoon = require('raccoon_v0125');
function FetchSongs() {
    return __awaiter(this, void 0, void 0, function* () {
        const spotify = new spotify_web_api_ts_1.SpotifyWebApi({ accessToken: constants_1.SPOTIFY_TOKEN });
        const result = yield spotify.playlists.getPlaylist(constants_1.DUMMY_PLAYLIST_ID);
        const songData = yield spotify.tracks.getAudioFeaturesForTracks(result.tracks.items.map((e) => e.track.id));
        const resultantMatrix = songData.map((e, index) => __awaiter(this, void 0, void 0, function* () {
            return (yield raccoon.liked(index, [e.acousticness, e.tempo, e.energy, e.liveness, e.loudness, e.speechiness]));
        }));
        return yield raccoon.recommendFor(3, 10);
    });
}
exports.FetchSongs = FetchSongs;
//# sourceMappingURL=fetchSongs.js.map