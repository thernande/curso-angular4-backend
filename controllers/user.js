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
			message: "introduce bien los datos"
		});
	}
	//console.log(params);

	
}

module.exports = {
	pruebas,
	saveUser
}