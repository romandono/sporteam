'use strict'

//modules
const bcrypt = require('bcrypt');
const _ = require('underscore');

//modelos
const User = require('../models/user');

//acciones
function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando el controlador de usuarios y la acción pruebas'
    });
}

function saveUser(req, res) {
    // Recoger parámetros petición
    var params = req.body;

    // Asignar valores al objeto usuario

    let usuario = new User({
        nombre: params.nombre,
        apellido1: params.apellido1,
        apellido2: params.apellido2,
        email: params.email,
        image: null,
        password: bcrypt.hashSync(params.password, 10),
        role: params.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(200).send({
            ok: true,
            usuario: usuarioDB
        })
    });

}

function login(req, res) {
    res.status(200).send({
        message: 'Método del login'
    });
}

function updateUser(req, res) {

    let id = req.params.id;
    //Método pick selelcciona los atributes que si se pueden actualizar, el resto los ignora
    let body = _.pick(req.body, ['nombre', 'apellido1', 'apellido2', 'email', 'image', 'role', 'estado']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(200).send({
            ok: true,
            usuario: usuarioDB
        });
    });
}

function getUsuarios(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    User.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count({}, (err, total) => {
                res.status(200).send({
                    ok: true,
                    usuarios,
                    total: total
                });
            })

        });
}

//No borra al usuario de la BD, solo le cambia el estado(desactivado)
function deleteUser(req, res) {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };

    User.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        res.status(200).send({
            ok: true,
            usuario: usuarioBorrado
        });
    });
}

module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    getUsuarios,
    deleteUser
}