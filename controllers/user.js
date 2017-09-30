'use strict'

//modulos
var bcrypt = require('bcrypt-nodejs');

//modelos
var User = require('../models/user');

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
						res.status(200).send({user});
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

module.exports = {
	pruebas,
	saveUser,
	login
}