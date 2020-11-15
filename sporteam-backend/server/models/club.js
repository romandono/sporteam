'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClubSchema = Schema({
    localidad: String,
    provincia: String,
    zona: String,
    modalidad: String,
    users: { type: [Schema.Types.ObjectId], ref: 'User' }
});

module.exports = mongoose.model('Club', ClubSchema);