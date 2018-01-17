"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require ('http');
const DetailedFile_1 = require("../models/DetailedFile");
const utils = require("../utils/WopiUtil");
const ProcessWopiRequest = require("../utils/WopiProcess");



exports.getFileInfo = function (req, res) {
    ProcessWopiRequest.ProcessWopiRequest(req, res);
}

exports.getFile = function (req, res) {
    ProcessWopiRequest.ProcessWopiRequest(req, res);
}
//# sourceMappingURL=files.js.map