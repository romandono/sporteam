'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ZonaSchema = Schema({
    nombre: String
});

module.exports = mongoose.model('Zona', ZonaSchema);