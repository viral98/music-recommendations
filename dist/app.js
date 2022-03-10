"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cf_1 = require("./cf");
const fetchSongs_1 = require("./fetchSongs");
const app = (0, express_1.default)();
const port = 3000;
app.get('/', (req, res) => {
    (0, fetchSongs_1.FetchSongs)();
    const ratings = [
        [1, 1, 1],
        [1, 0, 1],
        [1, 0, 0],
    ];
    const result = (0, cf_1.collaborativeFilter)(ratings, 2);
    res.send(result);
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map