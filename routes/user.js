'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();

api.get('/pruebas-del-controllador', UserController.pruebas);
api.post('/save', UserController.saveUser);

module.exports = api;