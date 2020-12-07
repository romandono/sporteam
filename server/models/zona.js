'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ZonaSchema = Schema({
    nombreZona: String
});

module.exports = mongoose.model('Zona', ZonaSchema);