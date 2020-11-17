'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = require('./user');

UserSchema.discriminator('Jugador', Schema({
    nombreDeportivo: {
        type: String,
        required: [false]
    },
    fechaNacimiento: {
        type: Date,
        required: [true, 'La fecha de nacimiento es necesaria']
    },
    lateralidad: {
        type: String,
        required: [true, 'La lateralidad es necesaria']
    },
    demarcacion: {
        type: String,
        required: [true, 'La demarcación es necesaria']
    },
    altura: {
        type: Number,
        required: [true, 'La altura es necesaria']
    },
    peso: {
        type: Number,
        required: [true, 'El peso es necesario']
    }
}), );

module.exports = mongoose.model('Jugador');