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
				res.status(200).send({animals});
			}
		}
	});
}

function getAnimal(req, res){
	var animalId = req.params.id;

	Animal.findById(animalId).populate({path: 'user'}).exec((err, animal) => {
		if(err){
				res.status(500).send({ error: 'Something failed!' });
		}
		else
		{
			if(!animal){
				res.status(404).send({ error: 'no se pudo encontrar el animal' });
			}
			{
				res.status(200).send({animal});
			}
		}
	})
}

function updateAnimal(req, res){
	var animalId = req.params.id;
	var update = req.body;

	Animal.findByIdAndUpdate(animalId, update, {new:true}, (err, animalUpdate) =>{
		if(err){
			res.status(500).send({ error: 'Something failed!' });
		}
		else
		{
			if(!animalUpdate){
				res.status(404).send({ error: 'no se pudo actualizar el animal' });
			}
			else
			{
				res.status(200).send({animalUpdate});
			}
		}
	})
}

function uploadImage(req, res){
	var animalId = req.params.id;
	var file_name = 'empty';
	//console.log(req.files);
	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		file_name = file_split[2];

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];

		if(file_ext == "png" || file_ext == "jpg" || file_ext == "jpeg" || file_ext == "gif"){
			
			/*if(animalId != req.animal.sub){
				return res.status(404).send({
					message: "no tienes permiso para actualizar el animal"
				})
			}*/

			Animal.findByIdAndUpdate(animalId, {image: file_name}, {new:true}, (err, animalUpdate) =>{
				if (err) {
					res.status(500).send({message:'Error al actualizar el animal'});
				}else{
					if(!animalUpdate){
						res.status(404).send({message:'no se ha podido actualizar el animal'});
					}else{
						res.status(200).send({animal: animalUpdate, image: file_name});
					}
				}
			});

		}else{
			fs.unlink(file_path, (err) =>{
				if (err) {
					res.status(200).send({message:'invalid form and file erase'});
				}
				else{
					res.status(200).send({message:'invalid form'});
				}
			})

			
		}
		
	}else{
		res.status(404).send({message:'the image has not been upload'});
	}
}

function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var pathFile = './uploads/animals/'+imageFile;

	fs.exists(pathFile, function(exists){
		if(exists){
			res.sendFile(path.resolve(pathFile));
		}else
		{
			res.status(404).send({message:'the image doesnt exists'});
		}
		
	});
	//res.status(200).send({message:'get image file'});
}

function deleteAnimal(req, res){
	var animalId = req.params.id;

	Animal.findByIdAndRemove(animalId, (err, animalRemove) => {
		if(err){
			res.status(500).send({ error: 'Something failed!' });
		}
		else
		{
			if(!animalRemove){
				res.status(404).send({ error: 'no se ha podido borrar el animal' });
			}
			else
			{
				res.status(200).send({animalRemove});
			}
		}
	});
}

module.exports = {
	pruebas,
	saveAnimal,
	getAnimals,
	getAnimal,
	updateAnimal,
	uploadImage,
	getImageFile,
	deleteAnimal
}