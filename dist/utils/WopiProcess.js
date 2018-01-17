"use strict";

const config = require("../config");
const WopiAction = require("./WopiAction");
const WopiUtil = require("./WopiUtil");
const path = require("path");
const linq = require("linq");
const cache = require("memory-cache");
const http = require("request");
const xml2js = require("xml2js");
const graphUtil = require ('./GraphUtil');


module.exports.ProcessWopiRequest = function (req, res) {

    //Write code to get file
   console.log(req.url + " " + req.method + "\n" + JSON.stringify(req.headers));
    var fileId = req.params.id;
    console.log(fileId);
    var file= {};
    const accessToken = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IkFRQUJBQUFBQUFCSGg0a21TX2FLVDVYcmp6eFJBdEh6elBmRGRuMjBBNnI4LVliSGZXSjdwNmlhY3BIYi1EMndtMlhGOW9ZcFVWQjVhdGttX3NJZXFueHBHUUxRcDczZGdFYUoxeHZsWGdrSDZPb29ENkpFQXlBQSIsImFsZyI6IlJTMjU2IiwieDV0IjoiejQ0d01kSHU4d0tzdW1yYmZhSzk4cXhzNVlJIiwia2lkIjoiejQ0d01kSHU4d0tzdW1yYmZhSzk4cXhzNVlJIn0.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82YmEwNDQzOS04YjBlLTQzZWUtYWQyNi1jMmFjOWVmOWU3NjUvIiwiaWF0IjoxNTE2MjEyNDAxLCJuYmYiOjE1MTYyMTI0MDEsImV4cCI6MTUxNjIxNjMwMSwiYWNyIjoiMSIsImFpbyI6IlkyTmdZRWdza21ydjU3TS83aXN0WlpkemZvdUJRTEptZWx0eGVmYUtKZjY4Vzk3M3ZRY0EiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkV4Y2VsIFBPQyIsImFwcGlkIjoiNjEzYjhmMWQtZmM2OC00Nzk1LWEyYTUtMmI1NThiN2NiNDQyIiwiYXBwaWRhY3IiOiIxIiwiZmFtaWx5X25hbWUiOiJVa2FuZHJhbyBHYWRyZSIsImdpdmVuX25hbWUiOiJWYWliaGF2IiwiaXBhZGRyIjoiMTA2LjUxLjcxLjQ3IiwibmFtZSI6IlZhaWJoYXYgVWthbmRyYW8gR2FkcmUiLCJvaWQiOiJjNzJhODZjOC1mZjUxLTRjMmYtYjNmNC0yMjMyNTFhZDVmMjYiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMjY0NDIwMDg1MC0zMjg5Mzg4NTQxLTI0MDIwMTQ2NjktMjQ2MDQiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzAwMDBBNjkzRDYzRSIsInNjcCI6IkNhbGVuZGFycy5SZWFkV3JpdGUgRmlsZXMuUmVhZFdyaXRlIE1haWwuUmVhZC5TaGFyZWQgTWFpbC5TZW5kIFVzZXIuUmVhZCBVc2VyLlJlYWRCYXNpYy5BbGwiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJtb056YmlDRzNEZGJiQTJQcmRVZmhPRE9fUVgwR0h5M2xjR3ctU1BqekgwIiwidGlkIjoiNmJhMDQ0MzktOGIwZS00M2VlLWFkMjYtYzJhYzllZjllNzY1IiwidW5pcXVlX25hbWUiOiJ2YWliaGF2QFRyaWNvbmluZm90ZWNoLmNvbSIsInVwbiI6InZhaWJoYXZAVHJpY29uaW5mb3RlY2guY29tIiwidXRpIjoiSUNvLW51WWN2RUtQYWZTekpteFJBQSIsInZlciI6IjEuMCJ9.UYiyH0BRNrJc_Qzy4z5L2BlW5fRDyPhu5ZrT7-9v9zMbqnjrSHgMwhc1U3Lx8_nz0xtnajcYuKUJDOx7PxfUa4fJvJgfGRTKHIv9QdOnFL81Kq5m8fUOwhugZ_ORdDsCCpTGkFhvz8RUXuXjQCbP5gu5TYj6TjORK1pWr-A0SHJdgl1jmDAWbg9LdoVjMA-fcROzNniVOXT3LjHzkiuljnZ8nCUKJu0GxPUwanbWqfeOVsfJ-_8iLpvJSO6s2_z8sPZ-gZgPmC3r_bxsIu31uHKkR7dp5PtV6PjEx9VZbH94VYH6GKRH_D4LIi_Zra1LVtbVUadwOmLC0Mzh_pr5nA";
    // get office online file graph api endpoint call;
    graphUtil.getDriveFile (accessToken, fileId, (err, file) => {
        if(!err) {
            console.log("ID: " + file.id + "  Name: " + file.name);
             file = file;
        }
    })

    if (file === null) {
        res.sendStatus(404);
    } else {
        // Validate WOPI Proof (ie - ensure request came from Office Online)
        if (WopiUtil.validateProof()) {
            // Get discovery information
            var fileExt = "xlsx";  //file.BaseFileName.substring(file.BaseFileName.lastIndexOf(".") + 1).toLowerCase();
            WopiUtil.GetDiscoveryInfo( (err, actions) => {
                // Augments the file with additional properties CloseUrl, HostViewUrl, HostEditUrl
            file.closeUrl = "https://" + config.Constants.WOPI_AUTHORITY_URL;

            var view = linq.from(actions).where(i => i.ext == fileExt && i.name == "view").firstOrDefault();

            //console.log("view value: " +JSON.stringify(view));

            if (view != null) {
                WopiUtil.GetActionUrl(view, fileId, config.Constants.WOPI_AUTHORITY_URL, (viewUrl) => {
                    if(!err) {
                        file.HostViewUrl = viewUrl; 
                     }
                 });
            }

            var edit = linq.from(actions).where(i => i.ext == fileExt && i.name == "edit").firstOrDefault();

            if (edit != null) {
                WopiUtil.GetActionUrl(edit, fileId, config.Constants.WOPI_AUTHORITY_URL, (editUrl) => {
                    file.HostEditUrl = editUrl;
                });
            }
                       
                console.log(file);

            });

            res.end("Done...");
                        // Get the user from the token (token is already validated)
           // file.UserId = WopiSecurity.GetUserFromToken(request.AccessToken);

            // Call the appropriate handler for the WOPI request we received

    /*        switch (req.RequestType) {
                case WopiRequestType.CheckFileInfo:
                    res = CheckFileInfo(req, file);
                    break;
                case WopiRequestType.GetFile:
                    res = GetFile(file);
                    break;
                case WopiRequestType.Lock:
                    res = Lock(file);
                    break;
                case WopiRequestType.GetLock:
                    res = GetLock(file);
                    break;
                case WopiRequestType.RefreshLock:
                    res = RefreshLock(file);
                    break;
                case WopiRequestType.Unlock:
                    res = Unlock(file);
                    break;
                case WopiRequestType.UnlockAndRelock:
                    res = UnlockAndRelock(file);
                    break;
                case WopiRequestType.PutFile:
                    res = PutFile(file);
                    break;
                case WopiRequestType.PutRelativeFile:
                    res = PutRelativeFile(file, actions);
                    break;
                case WopiRequestType.RenameFile:
                    res = RenameFile(file);
                    break;
                case WopiRequestType.PutUserInfo:
                    res = PutUserInfo(file);
                    break;
                default:
                    res.sendStatus(404);
                    break;
            }

        } else {
            res.sendStatus(500);
        } */

    }; 
  }
}

module.exports.CheckFileInfo = function (req, file) {
   return JSON.stringify(file)
};
