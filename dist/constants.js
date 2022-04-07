"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPOTIFY_TOKEN = exports.DUMMY_PLAYLIST_ID = exports.SPOTIFY_PLAYLIST_TO_SONG_URL = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const SPOTIFY_PLAYLIST_TO_SONG_URL = (playlist_id) => `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
exports.SPOTIFY_PLAYLIST_TO_SONG_URL = SPOTIFY_PLAYLIST_TO_SONG_URL;
exports.DUMMY_PLAYLIST_ID = "37i9dQZF1E38GzV4rvBzBp";
exports.SPOTIFY_TOKEN = process.env.SPOTIFY_KEY;
//# sourceMappingURL=constants.js.map