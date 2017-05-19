"use strict";

var express = require('express');
var router = express.Router();

var passport = require('passport');
var requireApiAuthentication = passport.authenticate('jwt', {session: false});

var authApiHandler = require('./authApiHandler');
router.get('/api/auth/user', requireApiAuthentication, authApiHandler.getUser);
router.post('/api/auth/user', authApiHandler.postUser);
router.post('/api/auth/login', authApiHandler.postLogin);

var projectsApiHandler = require('./projectsApiHandler');
router.get('/api/projects', requireApiAuthentication, projectsApiHandler.getProjects);
router.get('/api/projects/:id', requireApiAuthentication, projectsApiHandler.getProject);
router.post('/api/projects', requireApiAuthentication, projectsApiHandler.postProject);
router.put('/api/projects/:id', requireApiAuthentication, projectsApiHandler.putProject);
router.delete('/api/projects/:id', requireApiAuthentication, projectsApiHandler.deleteProject);

var timesheetsApiHandler = require('./timesheetsApiHandler');
router.get('/api/timesheets', requireApiAuthentication, timesheetsApiHandler.getTimesheets);
router.get('/api/timesheets/:id', requireApiAuthentication, timesheetsApiHandler.getTimesheet);
router.post('/api/timesheets', requireApiAuthentication, timesheetsApiHandler.postTimesheet);
router.put('/api/timesheets/:id', requireApiAuthentication, timesheetsApiHandler.putTimesheet);
router.delete('/api/timesheets/:id', requireApiAuthentication, timesheetsApiHandler.deleteTimesheet);

var employeesApiHandler = require('./employeesApiHandler');
router.get('/api/employees', requireApiAuthentication, employeesApiHandler.getEmployees);
/* todo:
router.get('/api/employees/:id', requireApiAuthentication, employeesApiHandler.getEmployee);
router.post('/api/employees', requireApiAuthentication, employeesApiHandler.postEmployee);
router.put('/api/employees/:id', requireApiAuthentication, employeesApiHandler.putEmployee);
router.delete('/api/employees/:id', requireApiAuthentication, employeesApiHandler.deleteEmployee);
*/
module.exports = router;
