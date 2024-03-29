const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = require('./user');

UserSchema.discriminator('Entrenador', Schema({
    nombreDeportivo: {
        type: String
    },
    entrenadorPorteros: {
        type: Boolean,
        default: false
    },
    titulacion: {
        type: [String]
    },
    telefono: {
        type: Number
    }
}));

module.exports = mongoose.model('Entrenador');