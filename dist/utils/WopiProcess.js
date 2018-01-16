"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../config");
const WopiAction = require("./WopiAction");
const WopiUtil = require("./WopiUtil");
const path = require("path");
const linq = require("linq");
const cache = require("memory-cache");
const http = require("request");
const xml2js = require("xml2js");


exports.ProcessWopiRequest = function (req, res) {

    //Write code to get file

    var id = req.params.id
    var file = ""// get office online file graph api endpoint call;

    if (file === null) {
        res.sendStatus(404);
    } else {
        // Validate WOPI Proof (ie - ensure request came from Office Online)
        if (WopiUtil.validateProof()) {
            // Get discovery information
            var fileExt = file.BaseFileName.substring(file.BaseFileName.lastIndexOf(".") + 1).toLowerCase();
            var actions = WopiUtil.GetDiscoveryInfo();

            // Augments the file with additional properties CloseUrl, HostViewUrl, HostEditUrl
            file.closeUrl = "https://" + config.Constants.WOPI_AUTHORITY_URL;
            var view = linq.from(actions).where(i => i.ext == fileExt && i.name == "view").firstOrDefault();
            if (view != null)
                file.HostViewUrl = WopiUtil.GetActionUrl(view, file, context.Request.Url.Authority);
            var edit = linq.from(actions).where(i => i.ext == fileExt && i.name == "edit").firstOrDefault();
            if (edit != null)
                file.HostEditUrl = WopiUtil.GetActionUrl(edit, file, context.Request.Url.Authority);

            // Get the user from the token (token is already validated)
            file.UserId = WopiSecurity.GetUserFromToken(request.AccessToken);

            // Call the appropriate handler for the WOPI request we received
            switch (req.RequestType) {
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
        }

    }
}

exports.CheckFileInfo = function (req, file) {
   return JSON.stringify(file)
};
