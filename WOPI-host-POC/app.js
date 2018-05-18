const express = require("express");
//const dotenv = require("dotenv");
// import * as compression from "compression";
//const logger = require("morgan");
const bodyParser = require("body-parser");
//const expressValidator = require("express-validator");
const path = require("path");
const xml2js = require("xml2js");
const http = require("http");
const request = require("request");
var fs = require("fs");
const ejs = require('ejs');

// controllers
const wopiUtil = require("./utils/wopiUtil");
// const filesController = require("./controllers/files");
// token security code
const tokenValidator = require("./security/tokenValidator");
const app = express();
app.set("port", process.env.PORT || 3000);
// app.use(compression());
// app.use(logger("dev"));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(expressValidator());
app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);
// Routes
const File = require("./models/fileModel");
function stripHyphens(name) {
  return name.replace("-", "");
}
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/wopi");

var db = mongoose.connection;

mongoose.Promise = global.Promise;

db.on("error", err => {
  console.log(err);
});

db.once("open", function() {
  console.log("The DB is connected successfully.");
});

app.get('/', (req, res) => {
  res.render('index', {
    actionUrl: "https://excel.officeapps-df.live.com/x/_layouts/xlviewerinternal.aspx?ui=en-US&rs=en-US&dchat=1&IsLicensedUser=0&WOPISrc=https://localhost:3200/wopi/files/01N7NB4CGFCVLYGC2E7NEKEBGDPZJ27QEI" ,
    accessToken:"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0cmljb24iLCJpc3MiOiJodHRwczovL3dvcGkudHJpY29uaW5mb3RlY2guY29tIiwicGVybWlzc2lvbnMiOiJlZGl0LWZpbGVzIiwiaWF0IjoxNTI2NjMzMTM0LCJleHAiOjE1MjcwNjUxMzR9.McAW6gSo_dn581lXCU-lfm27_mSQ8RXfCgS4tSAgthQkBUKZknpjJgLKPEtEE27fdpWcYgOxEBTPkOuckZe6ViN3n9SI_251NoeIrFultPMKws870OOSPv6gPHLSpvxEyqnH0fs3p4oGpHfH_g15OxGIYQVnhjj10gFpactFMN0",
    accessTokenTtl:"1527065134"
  })
})

app.get("/wopi/files/:id/contents",tokenValidator.isValidToken, (req, res) => {
  // File.findByIdAndUpdate(req.params.id)
  //   .then(file => {
  // console.log(file.data.buffer);
  // let str = Buffer.from(file.data.buffer).toString();

  var file = fs.createWriteStream("./copy.xlsx");
  http
    .get(
      "http://cdcontent.books24x7.com/id_16959/financial%20statements.xlsx",
      function(response) {
       // res.send(response);
        response.pipe(res);
        // file.on("finish", function() {
        //   file.close(); // close() is async, call cb after close completes.
        //   res.end();
        })
    //   }
    // )
    .on("error", function(err) {
      // Handle errors
      res.send(err);
    });
  // let data;
  // var fileStream = fs.createReadStream("./test.xlsx", { encoding: "utf8" });
  // var writeStream = fs.createWriteStream("./copy.xlsx", { encoding: "utf8" });
  // fileStream.on("data", chunk => {
  //   fileStream.pipe(writeStream);
  // });

  // fileStream.on("open", () => {
  //   fileStream.pipe(res);
  // });

  // fileStream.on("end", () => {
  //   res.end();
  // });
  // fileStream.on("error", () => {
  //   res.send(err);
  // });
  //   fs.writeFile("./copy1.xlsx", "", { encoding: "utf8" }, err => {
  //     if (err) {
  //       res.send(err);
  //     }
  //     res.end();
  //   });
  // })
  // .catch(err => {
  //   res.send(err);
  // });
});

app.get("/access-token", (req, res) => {
  const token = tokenValidator.createToken({
    userId: "tricon",
    iss: "https://wopi.triconinfotech.com",
    permissions: "edit-files"
  });
  tokenValidator
    .validateToken(token.token)
    .then(decoded => {
      res.send({ decoded, token });
    })
    .catch(err => {
      res.send(err);
    });
});

app.get("/actions", (req, res) => {
  // const stats = fs.statSync("./test.xlsx");
  // const fileSizeInBytes = stats.size;
  // console.log(fs.statSync("./test.xlsx").size);
  // console.log(
  //   `request data:  ${JSON.stringify(
  //     req.query.vai
  //   )} \n ${req.path.toLowerCase().includes("contents")}`
  // );

  // // res.set("x-access-token", "vaibhav1232311ewq");
  // //res.sts()
  // res.end();
    let rawXML = "";
    request
      .get("https://onenote.officeapps-df.live.com/hosting/discovery", function(
        error,
        response,
        body
      ) {})
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
            let filterAction = actionMap.filter(action => {
              return (
                 action.ext === "xlsx"// &&
                // (action.name === "view" || action.name === "edit")
              );
            });
            res.send(filterAction);
          }
        );
      });  
});

app
  .route("/wopi/files/:id")
  .all(tokenValidator.isValidToken)
  .get(wopiUtil.processWopiRequest)
  .post(wopiUtil.processWopiRequest);
// app
//   .route("/wopi/files/:id/contents")
//   .all(tokenValidator.isValidToken)
//   .get(wopiUtil.processWopiRequest)
//   .post(wopiUtil.processWopiRequest);

  module.exports.app = app;

// start the server
// app.listen(app.get("port"), () => {
//   console.log(
//     "  App is running at http://localhost:%d in %s mode",
//     app.get("port"),
//     app.get("env")
//   );
//   console.log("  Press CTRL-C to stop\n");
// });

// app.get("/", function(request, response) {
//   response.send(
//     '<form method="post" action="/fileupload" enctype="multipart/form-data">' +
//       '<input type="file" id="file" name="file">' +
//       '<input type="submit" value="submit">' +
//       "</form>"
//   );
// });

// app.get("/file-upload", function(req, res) {
//   // var writestream = fs.createWriteStream("./copy.xlsx");
//   let data;
//   var fileData = fs.readFile(
//     path.join(__dirname, "./test.xlsx"),
//     //{ encoding: "utf8" },
//     (err, data) => {
//       File.create({ fileName: "test.xlsx", data: data })
//         .then(file => {
//           console.log(file);
//           res
//             .status(201)
//             .json("File is saved successfully with id: " + file.id);
//         })
//         .catch(err => {
//           res.status(400).send("Error while saving file: " + err);
//         });
//     }
//   );
//   //res.send(fileData);
// });

// {/* <action name="view" ext="xlsx" default="true"
//  urlsrc="https://excel.officeapps-df.live.com/x/_layouts/xlviewerinternal.aspx?ui=en-US&rs=en-US&dchat=1&IsLicensedUser=0&WOPISrc=https://localhost:3200/wopi/files/01N7NB4CGFCVLYGC2E7NEKEBGDPZJ27QEI" */}