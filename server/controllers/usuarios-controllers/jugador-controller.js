/**
 * Imports de modelos
 */
const Jugador = require('../../models/user-models/jugador');
const _ = require('underscore');

/**
 * Utilidades para homogenizar y reducir código
 */
const { getPropiedadesAMostrarUsuario, getPropiedadesComunesUsuario, camposToUpdate } = require('./utils-users-controller');

// Constante que almacena os campos que se mostrarán nas consultas.
const camposAMostrar = getPropiedadesAMostrarUsuario();

/**
 * Devuelve un listado de jugadores paginados
 * @param {*} req 
 * @param {*} res 
 */
let getJugadores = (req, res) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 20;

    Jugador.find({ estado: true }, camposAMostrar)
        .skip(Number(desde))
        .limit(Number(limite))
        .exec((err, jugadores) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se pudo recuperar ningún jugador.'
                });
            }

            Jugador.countDocuments({}, (err, total) => {
                res.status(200).send({
                    ok: true,
                    jugadores,
                    total: total
                });
            })
        });
}

/**
 * Devuelve un jugador a partír de un id
 * @param {*} req 
 * @param {*} res 
 */
let getJugador = (req, res) => {

    let id = req.params.id;

    Jugador.findById(id, camposAMostrar, (err, jugador) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'No se pudo recuperar ningún jugador.'
            });
        }

        res.status(200).send({
            ok: true,
            jugador
        });
    });
}

/**
 * Almacena un jugador
 * @param {*} req 
 * @param {*} res 
 */
let saveJugador = (req, res) => {

    let params = req.body;
    let camposComunesUsuario = getPropiedadesComunesUsuario(params);

    let jugador = new Jugador({
        ...camposComunesUsuario,
        estadoDeportivo: params.estadoDeportivo,
        nombreDeportivo: params.nombreDeportivo,
        fechaNacimiento: Date.parse(params.fechaNacimiento),
        lateralidad: params.lateralidad,
        demarcacion: params.demarcacion,
        altura: params.altura,
        peso: params.peso
    });

    jugador.save((err, jugadorDB) => {

        if (err) {
            return res.status(400).send({
                ok: false,
                err
            });
        }

        res.status(200).send({
            ok: true,
            jugador: jugadorDB
        })
    });
}

let updateJugador = (req, res) => {

    let id = req.params.id;
    let camposActualizar = camposToUpdate().camposComunes.concat(camposToUpdate().camposJugador);

    let body = _.pick(req.body, camposActualizar);

    Jugador.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, jugadorDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(200).send({
            ok: true,
            jugador: jugadorDB
        });
    });
}

module.exports = {
    getJugadores,
    getJugador,
    saveJugador,
    updateJugador
}