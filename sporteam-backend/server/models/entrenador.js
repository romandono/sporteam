'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = require('./user');

var EntrenadorSchema = UserSchema.discriminator(new Schema({
    nombreDeportivo: String,
    entrenadorPorteros: Boolean,
    titulacion: [String],
    telefono: Number,
    estado: String
}));

module.exports = mongoose.model('Entrenador', EntrenadorSchema);