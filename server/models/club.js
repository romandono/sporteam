const mongoose = require('mongoose');
const ProvinciaModel = require('./provincia');
const ZonaModel = require('./zona');
var Schema = mongoose.Schema;

var ClubSchema = Schema({
    nombre: String,
    localidad: String,
    provincia: {
        type: ProvinciaModel.schema,
        ref: 'Provincia'
    },
    modalidad: String,
    image: String,
    zona: {
        type: ZonaModel.schema,
        ref: 'Zona'
    },
    users: { type: [Schema.Types.ObjectId], ref: 'User' },
    userLogued: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Club', ClubSchema);