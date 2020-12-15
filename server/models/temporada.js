var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TemporadaSchema = Schema({
    anho: String
});

module.exports = mongoose.model('Temporada', TemporadaSchema);