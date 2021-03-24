const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const User = require('../models/user-models/user');
const { generarJWT } = require('../helpers/jwt');
const { response } = require('express');

let login = async(req, res = response) => {

    let body = req.body;

    const usuarioDB = await User.findOne({ email: body.email });

    if (!usuarioDB) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Usuario o contraseña incorrectos'
            }
        });
    }

    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Usuario o contraseña incorrectos'
            }
        });
    }

    const token = await generarJWT(usuarioDB.id);

    res.json({
        ok: true,
        token
    });

}

// Configuraciones de Google
let verify = async(token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        image: payload.picture,
        google: true
    }
}

let loginGoogle = async(req, res) => {

    let token = req.body.token;

    let googleUser = await verify(token)
        .catch(e => {
            res.status(403).send({
                ok: false,
                err: e
            });
        });
    User.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su usuario de aplicación'
                    }
                });
            } else {
                const token = generarJWT(usuarioDB.id)
                    .then(token => {
                        res.status(200).send({
                            ok: true,
                            token
                        });
                    })
                    .catch(err => {
                        res.status(400).send({
                            ok: false,
                            err
                        });
                    });
            }
        } else {
            // Si el usuario no existe todavía en nuestra BBDD
            let usuario = new User();

            usuario.nombre = googleUser.nombre.split(' ')[0];
            usuario.apellidos = googleUser.nombre.split(' ')[1] + ' ' + googleUser.nombre.split(' ')[2];
            usuario.email = googleUser.email;
            usuario.image = googleUser.image;
            usuario.google = true;
            // Da igual la contraseña en el login de google
            usuario.password = ':)';
            // Falta asignar el rol a cada usuario dependiendo de lo que escojan
            usuario.role = 'USER_ROLE';

            usuario.save((err, usuarioCreado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                const token = generarJWT(usuarioCreado.id)
                    .then(token => {
                        res.status(200).send({
                            ok: true,
                            token
                        });
                    })
                    .catch(err => {
                        res.status(400).send({
                            ok: false,
                            err
                        });
                    });
            });
        }
    });
}

const renewToken = async(req, res = response) => {

    const id = req.id;
    const token = await generarJWT(id);

    const usuario = await User.findById(id);

    res.json({
        ok: true,
        token,
        usuario
    });
}

module.exports = {
    login,
    loginGoogle,
    renewToken
}