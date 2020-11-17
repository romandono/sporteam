const bcrypt = require('bcrypt');

// Importamos el UserSchema para las consultas sobre usuarios de tipo jugador
const EntrenadorSchema = require('../models/entrenador');

function saveEntrenador(req, res) {

    let params = req.body;

    let entrenador = new EntrenadorSchema({
        nombre: params.nombre,
        apellido1: params.apellido1,
        apellido2: params.apellido2,
        email: params.email,
        password: bcrypt.hashSync(params.password, 10),
        role: params.role,
        image: null,
        estadoDeportivo: params.estadoDeportivo,
        zona: params.zona,
        nombreDeportivo: params.nombreDeportivo,
        entrenadorPorteros: params.entrenadorPorteros,
        titulacion: params.titulacion,
        telefono: params.telefono
    });

    entrenador.save((err, entrenadorDB) => {

        if (err) {
            return res.status(400).send({
                ok: false,
                err
            });
        }

        res.status(200).send({
            ok: true,
            entrenador: entrenadorDB
        })
    });
}

function getEntrenadores(req, res) {

    res.status(200).send({
        ok: true
    });
}

module.exports = {
    saveEntrenador,
    getEntrenadores
}