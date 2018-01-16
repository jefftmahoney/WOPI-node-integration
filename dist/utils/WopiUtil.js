"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../config");
const WopiAction = require("./WopiAction");
const path = require("path");
const linq = require("linq");
const cache = require("memory-cache");
const http = require("request");
const xml2js = require("xml2js");

function PopulateActions(files) {
    if (files.length > 0) {
        files.forEach(file => {
            PopulateActions(file);
        });
    }
    function PopulateActions(file) {
        let actions = GetDiscoveryInfo();
        let fileExt = path.extname(file.BaseFileName);
        file.Actions = linq.from(actions)
            .where(i => i.ext == fileExt)
            .orderBy(i => i.isDefault)
            .toArray();
    }
}

function GetDiscoveryInfo() {
    // look up the actions in the cache
    let actions = cache.get(config.Constants.WOPI_DISCOVERY_CACHE_KEY);
    // have we not already got the actions from WOPI Discovery?
    if (actions == null || actions.length == 0) {
        let rawXML = '';
        // hit the WOPI discovery endpoint
        http.get(config.Constants.WOPI_DISCOVERY_ENDPOINT, function (error, response, body) {
        })
            .on('data', function (data) {
                rawXML = rawXML + data;
            })
            .on('end', function () {
                xml2js.parseString(rawXML, { attrNameProcessors: [stripHyphens], tagNameProcessors: [stripHyphens] }, function (err, result) {
                    //console.log(result);
                    //  console.log(result.wopidiscovery.netzone[0].app);
                    // console.log(result.wopidiscovery.netzone[0].app.length);
                    actions = new Array();
                    for (var i = 0; i < result.wopidiscovery.netzone[0].app.length; i++) {
                        let thisApp = result.wopidiscovery.netzone[0].app[i];
                        //console.log("App Names: "+ i+ " "+ thisApp.$.name);
                        for (var j = 0; j < thisApp.action.length && thisApp.$.name === "Excel"; j++) {
                            let thisAction = thisApp.action[j];
                            let myApp = thisApp;
                            let thisWopiAction = new WopiAction.WopiAction();
                            thisWopiAction.app = myApp.$.name;
                            thisWopiAction.favIconUrl = myApp.$.favIconUrl;
                            thisWopiAction.checkLicense = (myApp.$.checkLicense === true);
                            thisWopiAction.name = thisAction.$.name;
                            thisWopiAction.ext = (thisAction.$.ext != null) ? thisAction.$.ext : '';
                            thisWopiAction.progId = (thisAction.$.progId != null) ? thisAction.$.progId : '';
                            thisWopiAction.isDefault = (thisAction.$.isDefault != null) ? thisAction.$.isDefault : true;
                            thisWopiAction.requires = (thisAction.$.requires != null) ? thisAction.$.requires : '';
                            thisWopiAction.urlsrc = thisAction.$.urlsrc;
                            actions.push(thisWopiAction);
                        }
                    }
                    // cache the actions
                    cache.put(config.Constants.WOPI_DISCOVERY_CACHE_KEY, actions, config.Constants.WOPI_DICCOVERY_CACHE_TTL);
                    let finalActions = actions;
                    console.log('retrieved actions from wopi discovery endpoint');
                    //  console.log(finalActions[0]);
                    GetActionUrl(finalActions[0], null, config.Constants.WOPI_AUTHORITY_URL);
                    return finalActions;
                });
            });
    }
    else {
        console.log('got actions from cache');
        console.log('actions');
        let finalActions = actions;
        return finalActions;
    }
}

function stripHyphens(name) {
    return name.replace('-', '');
}


function GetActionUrl(action, file, authority) {
    //get the action url
    var urlsrc = action.urlsrc;

    //Look through available placeholders
    var phCnt = 0;
    config.Constants.WOPI_URL_PH_LIST.forEach(function (p) {

        if (urlsrc.includes(p)) {
            var ph = getPlaceholderValue(p);
            if (p !== null || !p.length) {
                urlsrc = urlsrc.replace(p, ph + "&");
                phCnt++;
            }
            else {
                urlsrc = urlsrc.replace(p, ph);
            }
        }
    });

    //authority = 'triconindia-my.sharepoint.com';
    //Add WOPISrc to end of request 
    urlsrc += ((phCnt > 0) ? "" : "?") + 'WOPISrc=https://' + authority + '/wopi/files/' + '01N7NB4CBYJ3MVMIMCS5DYAIZ6B5IWBHDD'//String(file.id);
    console.log(urlsrc);
    return urlsrc;
}


function getPlaceholderValue(placeholder) {
    var ph = placeholder.substring(1, placeholder.indexOf("=") + 1);
    var result = "";

    switch (placeholder) {
        case config.Constants.WOPI_URL_PH_BUSINESS_USER:
            result = ph + "1";
            break;
        case config.Constants.WOPI_URL_PH_DC_LLCC:
        case config.Constants.WOPI_URL_PH_UI_LLCC:
            result = ph + "en-US";
            break;
        case config.Constants.WOPI_URL_PH_DISABLE_ASYNC:
        case config.Constants.WOPI_URL_PH_DISABLE_BROADCAST:
        case config.Constants.WOPI_URL_PH_EMBDDED:
        case config.Constants.WOPI_URL_PH_FULLSCREEN:
        case config.Constants.WOPI_URL_PH_RECORDING:
        case config.Constants.WOPI_URL_PH_THEME_ID:
            // These are all broadcast related actions
            result = ph + "true";
            break;
        case config.Constants.WOPI_URL_PH_DISABLE_CHAT:
            result = ph + "false";
            break;
        case config.Constants.WOPI_URL_PH_HOST_SESSION_ID:
        case config.Constants.WOPI_URL_PH_PERFSTATS:
            result = ph + ""; // No documentation
            break;
        case config.Constants.WOPI_URL_PH_VALIDATOR_TEST_CATEGORY:
            result = ph + "OfficeOnline"; //This value can be set to All, OfficeOnline or OfficeNativeClient to activate tests specific to Office Online and Office for iOS. If omitted, the default value is All.
            break;
        default:
            result = "";
            break;
    }

    return result;
}

exports.GetDiscoveryInfo = GetDiscoveryInfo;
exports.GetActionUrl = GetActionUrl;
exports.PopulateActions = PopulateActions;
//# sourceMappingURL=WopiUtil.js.map