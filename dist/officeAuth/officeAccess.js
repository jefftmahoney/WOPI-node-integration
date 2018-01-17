/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
// application dependencies
const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const uuid = require('uuid');
const config = require('./config.js');


// **IMPORTANT
// Note that production apps will need to create a self-signed cert and use a secure server,
// and change dev settings marked 'For development only' in app.js and config.js.
// Below is an example after you have the key cert pair:

// const https = require('https');
// const fs = require('fs');
// const certConfig = {
//  key: fs.readFileSync('./key.pem', 'utf8'),
//  cert: fs.readFileSync('./cert.pem', 'utf8')
// };
// const server = https.createServer(certConfig, app);

// authentication setup
const callback = (iss, sub, profile, accessToken, refreshToken, done) => {
  console.log(accessToken)
  done(null, {
    profile,
    accessToken,
    refreshToken
  });
};

passport.use(new OIDCStrategy(config.creds, callback));

const users = {};
passport.serializeUser((user, done) => {
  const id = uuid.v4();
  users[id] = user;
  done(null, id);
});

passport.deserializeUser((id, done) => {
  const user = users[id];
  done(null, user);
});



module.exports = passport;
