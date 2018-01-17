"use strict";

const passport = require ('passport');
const express = require('express');
const router = express.Router();
const graphUtil = require('../utils/GraphUtil');
const http = require ('http');


module.exports.getAccessToken = function (req, res, next)  {
    // Authentication request.
  http.get('http://localhost:3001/login',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
    (req, res) => {
        console.log(req.user.accessToken)
      //res.redirect('/token');  
    });

// Authentication callback.
// After we have an access token, get user data and load the sendMail page.
    http.get('http://localhost:3001/token',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
        (req, res) => {
            graphUtil.getDriveFile(req.user.accessToken, id, (err, file) => {
                console.log(file);
            })
        // res.send('<p>Token generated successfully.</p>')
    });
}
  

//module.exports = router;