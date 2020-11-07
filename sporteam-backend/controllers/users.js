'use strict'

//modules
var bcrypt = require('bcrypt-nodejs');

//modelos
var User = require('../models/user');

//acciones
function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando el controlador de usuarios y la acción pruebas'
    });
}

function saveUser(req, res) {
    var user = new User();

    // Recoger parámetros petición
    var params = req.body;

    if (params.password && params.nombre && params.apellido1 && params.apellido2 && params.email && params.role) {
        // Asignar valores al objeto usuario
        user.nombre = params.nombre;
        user.apellido1 = params.apellido1;
        user.apellido2 = params.apellido2;
        user.email = params.email;
        user.image = null;
        user.role = params.role;

        User.findOne({ email: user.email.toLowerCase() }, (err, issetUser) => {
            if (err) {
                res.status(500).send({ message: 'Error al comprobar el usuario' });
            } else {
                if (!issetUser) {
                    // Cifrar contraseña
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        user.password = hash;

                        // Guardar usuario
                        user.save((err, userStored) => {
                            if (err) {
                                res.status(500).send({
                                    message: 'Error al guardar el usuario'
                                });
                            } else {
                                if (!userStored) {
                                    res.status(404).send({ message: 'No se ha registrado el usuario' });
                                } else {
                                    res.status(200).send({ user: userStored });
                                }
                            }
                        });
                    });
                } else {
                    res.status(200).send({ message: 'El usuario ya existe en la BD' });
                }
            }
        });

    } else {
        res.status(200).send({
            message: 'Introduce los datos correctamente para registrar al usuario'
        });
    }
}

function login(req, res) {
    res.status(200).send({
        message: 'Método del login'
    });
}

module.exports = {
    pruebas,
    saveUser,
    login
}