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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cf_1 = require("./cf");
const fetchSongs_1 = require("./fetchSongs");
// import { attributes, GetNewRecommendations } from './fetchSongs';
const fetchSongs_2 = require("./fetchSongs");
const spotify_web_api_ts_1 = require("spotify-web-api-ts");
const constants_1 = require("./constants");
const app = (0, express_1.default)();
const port = 3000;
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const spotify = new spotify_web_api_ts_1.SpotifyWebApi({ accessToken: constants_1.SPOTIFY_TOKEN });
    const songData = yield (0, fetchSongs_1.FetchSongs)(spotify);
    const result = (0, cf_1.collaborativeFilter)(songData, 2);
    const playListData = yield spotify.playlists.getPlaylist(constants_1.DUMMY_PLAYLIST_ID);
    const commonLikings = playListData.tracks.items.map((e) => e.track.name).filter((value, index) => result.includes(index));
    (0, fetchSongs_2.GetNewRecommendations)(result);
    res.send(commonLikings);
}));
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map