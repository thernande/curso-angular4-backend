'use strict'

//modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

//modelos
var User = require('../models/user');

//servicio
var jwt = require('../services/jwt');

//acciones
function pruebas(req, res){
	res.status(200).send({
		message: "Probando el controlador de usuarios y la accion prueba"
	});
}

function saveUser(req, res){
	//iniciar el modelo
	var user = new User();
	//recoger valores del request
	var params = req.body;



	if(params.pass && params.name && params.surname && params.email){
		user.name = params.name;
		user.surname = params.surname;
		user.email = params.email;
		user.role = 'ROLE_USER';
		user.image = null;

		User.findOne({email:user.email.toLowerCase()}, (err, issetUser) => {
			if (err) {
				res.status(500).send({message:'Error al comprobar el usuario'});
			}else{
				if(!issetUser){
					//cifrado de la contraseña
					bcrypt.hash(params.pass, null, null, function(err,hash){
						user.pass = hash;

						user.save((err, userStored) => {
							if(err){
								res.status(500).send({message:'error al guardar el usuario'});
							}else{
								if(!userStored){
									res.status(404).send({message:'no se ha registrado el usuario'});
								}else{
									res.status(200).send({user: userStored});
								}
							}
						})
					});
				}else{
					res.status(200).send({
						message: "el usuario ya existe"
					});
				}
			}
		})
	}else{
		res.status(200).send({
			message: "introduce bien los datos"
		});
	}

	//console.log(params);
}

function login(req, res){
	var params = req.body;
	var pass = params.pass;

	var email = params.email;
	User.findOne({email: email.toLowerCase()}, (err, user) => {
		if (err) {
			res.status(500).send({message:'Error al comprobar el usuario'});
		}else{
			if(!user){
				res.status(404).send({
					message: "El usuario no existe"
				});
			}else{
				bcrypt.compare(pass, user.pass, (err, check) => {
					if(check){
						//comprobar el token
						if(params.gettoken){
							//crear token
							res.status(200).send({
								token: jwt.createToken(user)
							});
						}else{
							res.status(200).send({user});
						}
					}else{
						res.status(404).send({
							message: "Contraseña incorrecta"
						});
					}
				});
			}
		}
	});
}

function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;
	//borrar el campo pass del update
	delete update.pass
	if(userId != req.user.sub){
		return res.status(404).send({
			message: "no tienes permiso para actualizar el usuario"
		})
	}

	User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdate) =>{
		if (err) {
			res.status(500).send({message:'Error al actualizar el usuario'});
		}else{
			if(!userUpdate){
				res.status(404).send({message:'no se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({userUpdate});
			}
		}
	});

}

function uploadImage(req, res){
	var userId = req.params.id;
	var file_name = 'empty';
	//console.log(req.files);
	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		file_name = file_split[2];

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];

		if(file_ext == "png" || file_ext == "jpg" || file_ext == "jpeg" || file_ext == "gif"){

			if(userId != req.user.sub){
				return res.status(404).send({
					message: "no tienes permiso para actualizar el usuario"
				})
			}

			User.findByIdAndUpdate(userId, {image: file_name}, {new:true}, (err, userUpdate) =>{
				if (err) {
					res.status(500).send({message:'Error al actualizar el usuario'});
				}else{
					if(!userUpdate){
						res.status(404).send({message:'no se ha podido actualizar el usuario'});
					}else{
						res.status(200).send({user: userUpdate, image: file_name});
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
	var pathFile = './uploads/users/'+imageFile;

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

function getKeepers(req,res){
	User.find({role:'ROLE_ADMIN'}).exec((err, users) => {
		if(err){
			res.status(500).send({message: 'there is a error'});
		}
		else
		{
			if (!users){
				res.status(404).send({message:'no hay datos'})
			}
			else
			{
				res.status(200).send({users});
			}
		}
	})
	//res.status(200).send({message: 'metodo get keepers'})
}

module.exports = {
	pruebas,
	saveUser,
	login,
	updateUser,
	uploadImage,
	getImageFile,
	getKeepers
}
