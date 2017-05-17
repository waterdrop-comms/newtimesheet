"use strict";

var mongoose = require('mongoose');

var timesheetSchema = new mongoose.Schema({
  username: String,
  weekEnding: Date,
  projects: [{
    name: String,
    hours: [Number]
  }]
});

module.exports = mongoose.model('timesheets', timesheetSchema);
