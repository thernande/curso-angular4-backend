'use strict'

//modulos
var fs = require('fs');
var path = require('path');

//modelos
var User = require('../models/user');
var Animal = require('../models/animal');

//servicio

//acciones
function pruebas(req, res){
	res.status(200).send({
		message: "Probando el controlador de animales", user: req.user
	});
}

function saveAnimal(req, res){
	var animal = new Animal;

	var params = req.body;

	if(params.name){
		animal.name = params.name;
		animal.description = params.description;
		animal.year = params.year;
		animal.image = null;
		animal.user = req.user.sub;

		animal.save((err, animalStored) => {
			if(err){
				res.status(500).send({ error: 'Something failed!' });
			}
			else{
				if(!animalStored){
					res.status(500).send({ message: "no se ha guardado el animal" });
				}
				else
				{
					res.status(200).send({animalStored});
				}
			}
		});
	}
	else
	{
		res.status(200).send({message: "el nombre es obligatorio"});
	}

	//res.status(200).send({message: "Probando el metodo de guardar"})
}

function getAnimals(req, res){
	Animal.find({}).populate({path: 'user'}).exec((err, animals) =>{
		if(err){
				res.status(500).send({ error: 'Something failed!' });
		}
		else
		{
			if(!animals){
				res.status(404).send({ error: 'no se pudo encontrar animales' });
			}
			{
				res.status(404).send({animals});
			}
		}
	});
}

module.exports = {
	pruebas,
	saveAnimal,
	getAnimals
}