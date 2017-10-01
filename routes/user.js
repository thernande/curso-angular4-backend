'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var mdAuth = require("../middlewares/authenticated");

api.get('/pruebas-del-controllador', mdAuth.ensureAuth, UserController.pruebas);
api.post('/save', UserController.saveUser);
api.post('/login', UserController.login);
api.put('/update-user/:id', mdAuth.ensureAuth, UserController.updateUser);

module.exports = api;