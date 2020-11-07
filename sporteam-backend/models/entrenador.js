'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EntrenadorSchema = Schema({
    nombreDeportivo: String,
    entrenadorPorteros: Boolean,
    titulacion: [String],
    telefono: Number,
    estado: String,
    user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Entrenador', EntrenadorSchema);