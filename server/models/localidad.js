var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocalidadSchema = Schema({
    nombre: String
});

module.exports = mongoose.model('Provincia', LocalidadSchema);