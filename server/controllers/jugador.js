const bcrypt = require('bcrypt');

// Modelo 
const JugadorSchema = require('../models/jugador');

let saveJugador = (req, res) => {

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

let getJugadores = (req, res) => {

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