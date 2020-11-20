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

/**
 * Utilidades para homogenizar y reducir código
 */
const { getPropiedadesAMostrarUsuario, getPropiedadesComunesUsuario } = require('./utils-users-controller');

// Constante que almacena os campos que se mostrarán nas consultas.
const camposAMostrar = getPropiedadesAMostrarUsuario();

/**
 * Devuelve un listado de usuarios paginados
 * @param {*} req 
 * @param {*} res 
 */
let getUsuarios = (req, res) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 20;

    User.find({ estado: true }, camposAMostrar)
        .skip(Number(desde))
        .limit(Number(limite))
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se pudo recuperar ningún usuario'
                });
            }

            User.countDocuments({}, (err, total) => {
                res.status(200).send({
                    ok: true,
                    usuarios,
                    total: total
                });
            })
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

let updateUser = (req, res) => {

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

//No borra al usuario de la BD, solo le cambia el estado(desactivado)
let deleteUser = (req, res) => {

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

let getUserImage = (req, res) => {

    let id = req.params.id;

    User.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        let pathImage = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.image}`);
        if (usuarioDB.image === null || usuarioDB.image.substring(0, 5) === 'https') {
            let noImage = path.resolve(__dirname, `../assets/no-image.jpg`);
            res.sendFile(noImage);
        } else {
            if (fs.existsSync(pathImage)) {
                res.sendFile(pathImage);
            } else {
                let noImage = path.resolve(__dirname, `../assets/no-image.jpg`);
                res.sendFile(noImage);
            }
        }
    });
}

module.exports = {
    getUsuarios,
    getUsuario,
    saveUser,
    updateUser,
    deleteUser,
    getUserImage
}