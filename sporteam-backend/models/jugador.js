'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JugadorSchema = Schema({
    nombreDeportivo: String,
    fechaNacimiento: Date,
    lateralidad: String,
    demarcacion: String,
    altura: Number,
    peso: Number,
    estado: String,
    user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Jugador', JugadorSchema);