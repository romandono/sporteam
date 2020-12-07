'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClubSchema = Schema({
    nombre: String,
    localidad: String,
    provincia: {
        type: Schema.ObjectId,
        ref: 'Provincia'
    },
    modalidad: String,
    image: String,
    zona: {
        type: Schema.ObjectId,
        ref: 'Zona'
    },
    users: { type: [Schema.Types.ObjectId], ref: 'User' },
    userLogued: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Club', ClubSchema);