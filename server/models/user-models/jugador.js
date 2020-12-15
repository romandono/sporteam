const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = require('./user');

UserSchema.discriminator('Jugador', Schema({
    nombreDeportivo: {
        type: String,
        required: [false]
    },
    fechaNacimiento: {
        type: String,
        required: [false, 'La fecha de nacimiento es necesaria']
    },
    lateralidad: {
        type: String,
        required: [false, 'La lateralidad es necesaria']
    },
    demarcacion: {
        type: [String],
        required: [false, 'La demarcación es necesaria']
    },
    altura: {
        type: Number,
        required: [false, 'La altura es necesaria']
    },
    peso: {
        type: Number,
        required: [false, 'El peso es necesario']
    },
    estadisticas: [{ type: Schema.Types.ObjectId, ref: 'Estadistica' }]
}), );

module.exports = mongoose.model('Jugador');