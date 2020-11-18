// Modelo 
const JugadorSchema = require('../../models/jugador');

// Utils usuario
const { partesComunesUsuario } = require('./utils-users-controller');

let saveJugador = (req, res) => {

    let params = req.body;

    let partesComunes = partesComunesUsuario(params)

    let jugador = new JugadorSchema({
        ...partesComunes,
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