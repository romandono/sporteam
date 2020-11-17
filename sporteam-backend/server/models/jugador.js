'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = require('./user');

var JugadorSchema = UserSchema.discriminator(new Schema({
    nombreDeportivo: String,
    fechaNacimiento: Date,
    lateralidad: String,
    demarcacion: String,
    altura: Number,
    peso: Number,
    estado: String
}));

module.exports = mongoose.model('Jugador', JugadorSchema);