var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const TemporadaModel = require('./temporada');

var EstadisticaSchema = Schema({
    partidosJugados: Number,
    goles: Number,
    asistencias: Number,
    tarjetasAmarillas: Number,
    tarjetasRojas: Number,
    temporada: {
        type: TemporadaModel.schema,
        ref: 'Temporada'
    }
});

module.exports = mongoose.model('Estadistica', EstadisticaSchema);