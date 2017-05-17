"use strict";

var mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    employeefirstname: String,
    employeelastname: String,
    employeemobile: String
});

module.exports = mongoose.model('employees', employeeSchema);

