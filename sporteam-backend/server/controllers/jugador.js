const bcrypt = require('bcrypt');

// Importamos el UserSchema para las consultas sobre usuarios de tipo jugador
const JugadorSchema = require('../models/jugador');

function saveJugador(req, res) {

    let params = req.body;

    let jugador = new JugadorSchema({
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

function getJugadores(req, res) {

    JugadorSchema.find({})
        .exec((err, jugadoresDB) => {

            if (err) {
                return res.status(400).send({
                    ok: false,
                    err
                });
            }

            res.status(200).send({
                ok: true,
                jugadores: jugadoresDB
            });
        });


}

module.exports = {
    saveJugador,
    getJugadores
}