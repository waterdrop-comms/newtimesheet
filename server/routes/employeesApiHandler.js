"use strict";

var models = require('../models');

/*
function validateUsername(req, res, project) {
  if (project.username !== req.user.username) {
    res.status(404).send('Project not found');
    return false;
  }
  return true;
}*/
/*
function validateName(req, res, project) {
  if (!project.name || project.name === '' || project.name.trim() === '') {
    res.status(400).send('Project name is required');
    return false;
  }
  return true;
}
*/
function validateUniqueName(req, res, project) {
  if (project) {
      res.status(400).send('Project already exists: ' + project.name);
      return false;
  }
  return true;
}

function findDuplicateName(employee, callback) {
    models.employee.findOne({
        'employeefirstname': employee.employeefirstname,
        'employeelastname' : employee.employeelastname,
        '_id': {$ne: employee._id}
    }, callback);
} 

function getEmployees(req, res) {    
    models.employee.find({/* 'employeefirstname': 'simon' */}, {}, {'sort': 'employeelastname'}, function (err, employees) {
        res.json(employees);
    }); 
}

function getEmployee(req, res) {
  models.employee.findById(req.params.id, function (err, employee) {
      //if (!validateUsername(req, res, employee)) return;
      res.json(employee);
  });
}

function postEmployee(req, res) {
    var employee = new models.employee(req.body);
    employee.employeefirstname = req.employee.employeefirstname;
    //if (!validateName(req, res, project)) return;
    findDuplicateName(employee, function (err, data) {
        if (!validateUniqueName(req, res, data)) return;
            employee.save(function (err, data) {
              console.log(err ? err : 'Created employee');
              res.send(data);
        });
    });
}
/*
function putProject(req, res) {
  console.log(req.body);
  models.project.findById(req.params.id, function (err, project) {
    project.name = req.body.name;
    if (!validateName(req, res, project)) return;
    if (!validateUsername(req, res, project)) return;
    findDuplicateName(project, function (err, data) {
      if (!validateUniqueName(req, res, data)) return;
      project.save(function (err, data) {
        console.log(err ? err : 'Updated project');
        res.send(data);
      });
    });
  });
}

function deleteProject(req, res) {
  models.project.findById(req.params.id, function (err, project) {
    if (!validateUsername(req, res, project)) return;
    project.remove(function (err) {
      console.log(err ? err : 'Deleted project');
      res.send('');
    });
  });
}
*/

module.exports = {
  getEmployees: getEmployees,
  getEmployee: getEmployee,
  postEmployee: postEmployee/*,
  putProject: putProject,
  deleteProject: deleteProject */
};
