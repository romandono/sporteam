const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const User = require('../models/user-models/user');

let login = (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

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

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.status(200).send({
            ok: true,
            usuario: usuarioDB,
            token
        });

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

    let token = req.body.idtoken;

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
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.status(200).send({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            // Si el usuario no existe todavía en nuestra BBDD
            let usuario = new User();

            usuario.nombre = googleUser.nombre.split(' ')[0];
            usuario.apellido1 = googleUser.nombre.split(' ')[1];
            usuario.apellido2 = googleUser.nombre.split(' ')[2];
            usuario.email = googleUser.email;
            usuario.image = null;
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

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.status(200).send({
                    ok: true,
                    usuario: usuarioCreado,
                    token
                });
            });
        }
    });
}

module.exports = {
    login,
    loginGoogle
}