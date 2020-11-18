const _ = require('underscore');
const fs = require('fs');
const path = require('path');

// Modelo 
const User = require('../../models/user');

// Utils usuario
const { partesComunesUsuario } = require('./utils-users-controller');

//acciones
let pruebas = (req, res) => {
    res.status(200).send({
        message: 'Probando el controlador de usuarios y la acción pruebas'
    });
}

let saveUser = (req, res) => {

    // Recoger parámetros petición
    let params = req.body;

    // Asignar valores al objeto usuario
    let usuario = new User(partesComunesUsuario(params));

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

let getUsuarios = (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 50;
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
    pruebas,
    saveUser,
    updateUser,
    getUsuarios,
    deleteUser,
    getUserImage
}