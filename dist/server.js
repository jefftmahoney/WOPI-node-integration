"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dotenv = require("dotenv");
// import * as compression from "compression";
const logger = require("morgan");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const router = express.Router();
const http = require ('http');

const path = require("path");
dotenv.config();
// controllers
const homeController = require("./controllers/home");
const filesController = require("./controllers/files");

const session = require('express-session');
const passport = require ('./officeAuth/officeAccess');

// token security code
const tokenValidator = require("./security/tokenValidator");
const tokenGenerator = require ("./security/tokenGenerator");
const app = express();
app.set("port", process.env.PORT || 3001);

process.env.NODE_ENV= "development";

// app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));

// session middleware configuration
// see https://github.com/expressjs/session
app.use(session({
    secret: '12345QWERTY-SECRET',
    name: 'graphNodeCookie',
    resave: false,
    saveUninitialized: false,
    //cookie: {secure: true} // For development only
  }));
  
//office online authentication for getting access token  
app.use(passport.initialize());
app.use(passport.session());



// Routes
app.use("/", homeController);
// routing parameters are explained here: http://expressjs.com/en/guide/routing.html

app.route('/wopi/files/:id')
    .all(tokenValidator.isValidToken)
    .get(filesController.getFileInfo);


app.route('/wopi/files/:id/contents')
    .all(tokenValidator.isValidToken)
    .get(filesController.getFile);

// app.route('/wopi/folders/:id')
//   .all(tokenValidator.isValidToken)
//   .get(filesController.fileRequestHandler)
//   .post(filesController.fileRequestHandler)
//   ;
// app.route('/wopi/folders/:id/contents')
//   .all(tokenValidator.isValidToken)
//   .get(filesController.fileRequestHandler)
//   .post(filesController.fileRequestHandler)
//   ;
// start the server
app.listen(app.get("port"), () => {
    console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
    console.log("  Press CTRL-C to stop\n");
});
//# sourceMappingURL=server.js.map