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
const constants_1 = require("./constants");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');
function FetchSongs() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield axios
            .get((0, constants_1.SPOTIFY_PLAYLIST_TO_SONG_URL)(constants_1.DUMMY_PLAYLIST_ID), {
            headers: {
                'Authorization': `Bearer ${constants_1.SPOTIFY_TOKEN}`
            }
        });
        console.log(result);
    });
}
exports.FetchSongs = FetchSongs;
//# sourceMappingURL=fetchSongs.js.map