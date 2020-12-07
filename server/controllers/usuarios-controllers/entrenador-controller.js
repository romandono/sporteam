/**
 * Imports de modelos
 */
const { response } = require('express');
const Entrenador = require('../../models/user-models/entrenador');
const _ = require('underscore');

/**
 * Utilidades para homogenizar y reducir código
 */
const { getPropiedadesAMostrarUsuario, getPropiedadesComunesUsuario, camposToUpdate } = require('./utils-users-controller');

// Constante que almacena os campos que se mostrarán nas consultas.
const camposAMostrar = getPropiedadesAMostrarUsuario();

/**
 * Devuelve un listado de entrenadores paginados
 * @param {*} req 
 * @param {*} res 
 */
let getEntrenadores = (req, res) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 20;

    Entrenador.find({ estado: true })
        .skip(Number(desde))
        .limit(Number(limite))
        .exec((err, entrenadores) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se pudo recuperar ningún entrenador.'
                });
            }

            Entrenador.countDocuments({}, (err, total) => {
                res.status(200).send({
                    ok: true,
                    entrenadores,
                    total: total
                });
            })
        });
}

let getEntrenadoresBusqueda = (req, res) => {

    let termino = req.params.termino;
    const regex = new RegExp(termino, 'i');

    Entrenador.find({ nombre: regex })
        .exec((err, resultados) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se pudo recuperar ningún entrenador.'
                });
            }

            res.status(200).send({
                ok: true,
                resultados
            });

        });
}

let getEntrenadoresPorZona = (req, res = response) => {

    let idZona = req.params.idZona;

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;

    Entrenador.find().populate({
        path: 'zona',
        match: { _id: { $eq: idZona } },
        select: 'nombreZona'
    }).skip(desde).limit(limite).exec((err, entrenadores) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        entrenadores = _.filter(entrenadores, (entrenador) => {
            return entrenador.zona !== null;
        })

        res.status(200).json({
            ok: true,
            entrenadores
        });

    });
}

/**
 * Devuelve un entrenador a partír de un id
 * @param {*} req 
 * @param {*} res 
 */
let getEntrenador = (req, res) => {

    let id = req.params.id;

    Entrenador.findById(id, (err, entrenador) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'No se pudo recuperar ningún entrenador.'
            });
        }

        res.status(200).send({
            ok: true,
            entrenador
        });
    }).populate({ path: 'zona' }).populate({ path: 'club' });
}

/**
 * Almacena un entrenador
 * @param {*} req 
 * @param {*} res 
 */
let saveEntrenador = (req, res) => {

    let params = req.body;
    let camposComunesUsuario = getPropiedadesComunesUsuario(params)

    let entrenador = new Entrenador({
        ...camposComunesUsuario,
        estadoDeportivo: params.estadoDeportivo,
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

let updateEntrenador = (req, res) => {

    let id = req.params.id;
    let camposActualizar = camposToUpdate().camposComunes.concat(camposToUpdate().camposEntrenador);

    let body = _.pick(req.body, camposActualizar);
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
    Entrenador.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, entrenadorDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(200).send({
            ok: true,
            entrenador: entrenadorDB
        });
    });
}

module.exports = {
    getEntrenadores,
    getEntrenador,
    saveEntrenador,
    updateEntrenador,
    getEntrenadoresPorZona,
    getEntrenadoresBusqueda
}