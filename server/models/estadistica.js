var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EstadisticaSchema = Schema({
    partidosJugados: Number,
    goles: Number,
    asistencias: Number,
    tarjetasAmarillas: Number,
    tarjetasRojas: Number,
    temporada: {
        type: Schema.ObjectId,
        ref: 'Temporada'
    }
});

module.exports = mongoose.model('Estadistica', EstadisticaSchema);