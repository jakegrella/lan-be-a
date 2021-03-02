const express = require('express');
const passport = require('passport');

const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/user');
const BACKEND_URL = process.env.BACKEND_DEPLOYED_URL || 'http://localhost:5000';

const app = express.Router();

// const passportSetup = require('./config/passportSetup');
// //////////////////

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.find({ id: id }).then((user) => {
    done(null, user);
  });
});

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/linkedin/redirect`,
      scope: ['r_emailaddress', 'r_liteprofile'],
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        email: profile.emails[0].value,
        display_name: profile.displayName,
        profile_picture: profile.photos[3].value,
      };

      process.nextTick(() => {
        User.find({ id: user.id }).then((existingUser) => {
          if (existingUser) {
            return done(null, existingUser);
          } else {
            User.add(user).then((newUser) => {
              return done(null, newUser[0]);
            });
          }
        });
      });
    }
  )
);

// //////////////////

const FRONTEND_URL = process.env.FRONTEND_DEPLOYED_URL || 'http://localhost:3000';

// passportSetup();

// LinkedIn Auth Launch
app.get('/linkedin', passport.authenticate('linkedin'));

// LinkedIn Auth Redirect
app.get('/linkedin/redirect', passport.authenticate('linkedin', {
  failureRedirect: `${FRONTEND_URL}/error`
}), (request, response) => {
  response.redirect(`${FRONTEND_URL}/success`);
}
);

// Logout User
app.get('/logout', (request, response) => {
  request.logout();
  if (request.session) {
    request.session.destroy(err => {
      if (err) {
        response.status(500).json({ message: 'Error destroying session' });
      } else {
        response.status(200).clearCookie('LAN').json({ message: 'Signed out successfully' });
      }
    });
  } else {
    response.status(204).json({ message: 'Session does not exist' });
  }
});

module.exports = app;