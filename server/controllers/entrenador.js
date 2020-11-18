// Modelo 
const EntrenadorSchema = require('../models/entrenador');

// Utils usuario
const { partesComunesUsuario } = require('./utilsUsuario');

let saveEntrenador = (req, res) => {

    let params = req.body;

    let partesComunes = partesComunesUsuario(params)

    let entrenador = new EntrenadorSchema({
        ...partesComunes,
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

let getEntrenadores = (req, res) => {

    res.status(200).send({
        ok: true
    });
}

module.exports = {
    saveEntrenador,
    getEntrenadores
}