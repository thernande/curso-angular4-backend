'use strict'

var express = require('express');
var AnimalController = require('../controllers/animal');

var api = express.Router();
var mdAuth = require("../middlewares/authenticated");

var multipart = require('connect-multiparty');
var mdUpload = multipart({ uploadDir: './uploads/animals'});

api.get('/pruebas-animales', mdAuth.ensureAuth, AnimalController.pruebas);
api.post('/animal', mdAuth.ensureAuth, AnimalController.saveAnimal);


module.exports = api;