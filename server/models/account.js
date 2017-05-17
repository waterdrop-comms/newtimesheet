"use strict";

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('../config');

var accountSchema = new mongoose.Schema({});

accountSchema.plugin(require('passport-local-mongoose'));

accountSchema.methods.createJwt = function () {
  var claims = {
    sub: this._id,
    username: this.username
  };
  return jwt.sign(claims, config.jwt.secretOrKey);
};

module.exports = mongoose.model('Account', accountSchema);
