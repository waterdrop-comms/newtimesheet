"use strict";

var models = require('../models');


function validateEmployeename(req, res, employee) {
  if ((employee.employeefirstname !== req.employee.employeefirstname) && 
      (employee.employeelastname !== req.employee.employeelastname)) {
    res.status(404).send('employee not found');
    return false;
  }
  return true;
}

function validateName(req, res, employee) {
  if (!employee.employeefirstname || 
       employee.employeefirstname === '' || 
       employee.employeefirstname.trim() === '') {
      res.status(400).send('Employee name is required');
      return false;
  }
  return true;
}

function validateUniqueName(req, res, employee) {
  if (employee) {
      res.status(400).send('employee already exists: ' + employee.employeefirstname);
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
      if (!validateEmployeename(req, res, employee)) return;
      res.json(employee);
  });
}

function postEmployee(req, res) {
    var employee = new models.employee(req.body);
    employee.employeefirstname = req.employee.employeefirstname;
    employee.employeelastname = req.employee.employeelastname;
    employee.employeemobile = req.employee.employeemobile;

    if (!validateName(req, res, employee)) return;
    findDuplicateName(employee, function (err, data) {
        if (!validateUniqueName(req, res, data)) return;
            employee.save(function (err, data) {
              console.log(err ? err : 'Created employee');
              res.send(data);
        });
    });
}

function putEmployee(req, res) {
  console.log(req.body);
  models.employee.findById(req.params.id, function (err, employee) {
    employee.employeefirstname = req.body.employeefirstname;
    employee.employeelastname = req.body.employeelastname;
    employee.employeemobile = req.body.employeemobile;

    if (!validateName(req, res, employee)) return;
    if (!validateEmployeename(req, res, employee)) return;
    findDuplicateName(employee, function (err, data) {
      if (!validateUniqueName(req, res, data)) return;
      employee.save(function (err, data) {
        console.log(err ? err : 'Updated employee');
        res.send(data);
      });
    });
  });
}

function deleteEmployee(req, res) {
  models.employee.findById(req.params.id, function (err, employee) {
    if (!validateEmployeename(req, res, employee)) return;
    employee.remove(function (err) {
      console.log(err ? err : 'Deleted employee');
      res.send('');
    });
  });
}

module.exports = {
  getEmployees: getEmployees,
  getEmployee: getEmployee,
  postEmployee: postEmployee,
  putEmployee: putEmployee,
  deleteEmployee: deleteEmployee 
};
