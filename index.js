'use strict'

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/zoo',{ useMongoClient: true }).then(() => {
			console.log('la conexion a la base de datos se ha realizado correctamente...');
	})
	.catch(err => console.log(err));
