  "use strict";

  var passport = require('passport');
  var models = require('../models');

  function getUser(req, res) {
    res.json({
      username: req.user.username
    });
  }

  function postUser(req, res, next) {
    return models.account.register(new models.account({username: req.body.username}), req.body.password, function (err) {
      if (err) {
        console.warn('Register failed', err);
        return res.status(400).send(err.message).end();
      }
      return passport.authenticate('local', function (err, account) {
        if (err) {
          return next(err);
        }
        if (!account) {
          console.warn('Authentication failed', err);
          return res.status(401).end();
        }
        console.log('Authentication successful');
        return res.json({token: account.createJwt()});
      })(req, res, next);
    });
  }

  function postLogin(req, res, next) {
    return passport.authenticate('local', function (err, account) {
      if (err) {
        return next(err);
      }
      if (!account) {
        console.warn('Authentication failed', err);
        return res.status(401).end();
      }
      console.log('Authentication successful');
      return res.json({token: account.createJwt()});
    })(req, res, next);
  }

module.exports = {
  getUser: getUser,
  postUser: postUser,
  postLogin: postLogin
};
