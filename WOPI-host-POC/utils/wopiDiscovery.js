const xml2js = require("xml2js");
const cache = require("memory-cache");
const constants = require("../config/constants").Constants;
const path = require("path");
const request = require("request");

const populateActions = function(file) {
  //let actions = await ();
  let fileExt = path.extname(file.BaseFileName).slice(1);
  getDiscoveryInfo().then(actions => {
    actions.map(action => {
        return action.ext === fileExt;
      });
      return actions;
  }).catch(err => {
      console.log(err);
  })  
};

function stripHyphens(name) {
  return name.replace("-", "");
}

function getDiscoveryInfo() {
  return new Promise((resolve, reject) => {
    let actions = cache.get(constants.WOPI_DISCOVERY_CACHE_KEY);
    let filterAction;
    // verify if we already have actions from WOPI Discovery
    if (!actions || !actions.length) {
      let rawXML = "";
      request
        .get(
          "https://onenote.officeapps-df.live.com/hosting/discovery",
          function(error, response, body) {}
        )
        .on("data", function(data) {
          // console.log(data);
          rawXML = rawXML + data;
        })
        .on("end", function() {
          xml2js.parseString(
            rawXML,
            {
              attrNameProcessors: [stripHyphens],
              tagNameProcessors: [stripHyphens]
            },
            function(err, result) {
              let actions = result.wopidiscovery.netzone[0].app[0].action;
              let actionMap = actions.map(action => {
                return action.$;
              });
              filterAction = actionMap.filter(action => {
                return (
                  //action.ext === "xlsx" // &&
                  action.name === "view" || action.name === "edit"
                );
              });
              cache.put(
                constants.WOPI_DISCOVERY_CACHE_KEY,
                filterAction,
                constants.WOPI_DISCOVERY_CACHE_TTL
              );
              console.log("retrieved actions from wopi discovery endpoint");
              console.log(filterAction);
            }
          );
        })
        .on("error", err => {
          reject(err);
        });
    } else {
      console.log("got actions from cache");
      filterAction = actions;
    }
    resolve(filterAction);
  });
}

module.exports = {
  populateActions: populateActions
};
