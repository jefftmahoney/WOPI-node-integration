"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DetailedFile_1 = require("../models/DetailedFile");
const utils = require("../utils/WopiUtil");
exports.fileRequestHandler = (req, res) => {
    console.log('Handling ' + req.method + ' request for file/folder id ' + req.params["id"]);
    res.status(200).send({ 'title': 'fileHandler', 'method': req.method, 'id': req.params['id'] });
    let files = new Array();
    let xlFile = new DetailedFile_1.DetailedFile();
    xlFile.BaseFileName = 'myXLFile.xlsx';
    files.push(xlFile);
    // let docFile = new DetailedFile();
    // docFile.BaseFileName = 'myDocFile.docx';
    // let pptFile = new DetailedFile();
    // pptFile.BaseFileName = 'myPPTFile.pptx';
    // files.push(docFile);    
    // files.push(pptFile);
    utils.PopulateActions(files);
    console.log(files);
};
//# sourceMappingURL=files.js.map