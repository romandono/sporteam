/**
 * Imports Módulos 
 */
const _ = require('underscore');
const fs = require('fs');
const path = require('path');



/**
 * Imports de modelos
 */
const User = require('../../models/user-models/user');
const Zona = require('../../models/zona');

/**
 * Utilidades para homogenizar y reducir código
 */
const { getPropiedadesAMostrarUsuario, getPropiedadesComunesUsuario } = require('./utils-users-controller');
const { response } = require('express');

// Constante que almacena os campos que se mostrarán nas consultas.
const camposAMostrar = getPropiedadesAMostrarUsuario();

/**
 * Devuelve un listado de usuarios paginados
 * @param {*} req 
 * @param {*} res 
 */
let getUsuarios = (req, res) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 9;

    User.find({ role: { $ne: 'ADMIN_ROLE' } })
        .skip(Number(desde))
        .limit(Number(limite))
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se pudo recuperar ningún usuario'
                });
            }

            res.status(200).send({
                ok: true,
                usuarios,
                total: usuarios.length
            });
        });
}

/**
 * Devuelve un usuario a partír de un id
 * @param {*} req 
 * @param {*} res 
 */
let getUsuario = (req, res) => {

    let id = req.params.id;

    User.findById(id, camposAMostrar, (err, usuario) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'No se pudo recuperar ningún usuario.'
            });
        }

        res.status(200).send({
            ok: true,
            usuario
        });
    });
}

/**
 * Almacena un usuario
 * @param {*} req 
 * @param {*} res 
 */
let saveUser = (req, res) => {

    let params = req.body;
    let camposComunesUsuario = getPropiedadesComunesUsuario(params)

    let usuario = new User(camposComunesUsuario);

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

let updateUser = async(req, res = response) => {

    let id = req.params.id;
    //Método pick selelcciona los atributes que si se pueden actualizar, el resto los ignora

    let body = _.pick(req.body, ['nombre', 'apellidos', 'email', 'image', 'role', 'estado', 'zona', 'estadoDeportivo', 'usertype', 'club']);
    switch (body.role) {
        case 'JUGADOR_ROLE':
            body.usertype = 'Jugador';
            break;
        case 'ENTRENADOR_ROLE':
            body.usertype = 'Entrenador';
            break;
        case 'USER_ROLE':
            body.usertype = 'Usuario';
            break;
    }
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

//No borra al usuario de la BD, solo le cambia el estado(desactivado)
let deleteUser = (req, res) => {

    let id = req.params.id;

    User.findByIdAndDelete(id, (err, usuarioBorrado) => {
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
            message: 'Usuario eliminado'
        });
    });
}

let getUserImage = (req, res = response) => {

    let foto = req.params.foto;
    let tipo = req.params.tipo;

    let pathImage = path.resolve(__dirname, `../../../uploads/${tipo}/${foto}`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        const pathNoImage = path.join(__dirname, `../../../uploads/${tipo}/no-image.jpg`);
        res.sendFile(pathNoImage);
    }

}

module.exports = {
    getUsuarios,
    getUsuario,
    saveUser,
    updateUser,
    deleteUser,
    getUserImage
}