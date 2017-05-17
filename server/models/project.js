"use strict";

var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
  username: String,
  name: String
});

module.exports = mongoose.model('projects', projectSchema);

