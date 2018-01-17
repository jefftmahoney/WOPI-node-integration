"use strict";

const passport = require ('passport');
const express = require('express');
const router = express.Router();
const graphUtil = require('../utils/GraphUtil');
/**
 * GET /
 * Home page.
 */
// Get the home page.
router.get('/', (req, res) => {
    // check if user is authenticated
     res.redirect('/login');  
  });
  
  // Authentication request.
  router.get('/login',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
      (req, res) => {
        res.redirect('/token');  
      });
  
  // Authentication callback.
  // After we have an access token, get user data and load the sendMail page.
  router.get('/token',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
      (req, res) => {
          graphUtil.getDriveFile(req.user.accessToken, id, (err, file) => {
              console.log(file);
          })
       // res.send('<p>Token generated successfully.</p>')
});

module.exports = router;
//# sourceMappingURL=home.js.map