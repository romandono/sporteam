/**
 * Imports de modelos
 */
const Entrenador = require('../../models/user-models/entrenador');

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

    Entrenador.find({ estado: true }, camposAMostrar)
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

/**
 * Devuelve un entrenador a partír de un id
 * @param {*} req 
 * @param {*} res 
 */
let getEntrenador = (req, res) => {

    let id = req.params.id;

    Entrenador.findById(id, camposAMostrar, (err, entrenador) => {

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
    });
}

/**
 * Almacena un entrenador
 * @param {*} req 
 * @param {*} res 
 */
let saveEntrenador = (req, res) => {

    let params = req.body;
    let camposComunesUsuario = getPropiedadesComunesUsuario(params)

    let entrenador = new EntrenadorSchema({
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
    updateEntrenador
}