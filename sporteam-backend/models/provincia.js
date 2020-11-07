'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProvinciaSchema = Schema({
    nombre: String
});

module.exports = mongoose.model('Provincia', ProvinciaSchema);