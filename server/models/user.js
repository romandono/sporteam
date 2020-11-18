'use strict'

var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'JUGADOR_ROLE', 'ENTRENADOR_ROLE', 'CLUB_ROLE'],
    message: '{VALUE} no es un rol válido'
}
var Schema = mongoose.Schema;

const userOptions = {
    discriminatorKey: 'usertype',
    collection: 'users'
};

var UserSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellido1: {
        type: String,
        required: [true, 'El primer apellido es necesario']
    },
    apellido2: {
        type: String,
        required: [true, 'El segundo apellido es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    role: {
        type: String,
        required: [true, 'El rol de usuario es necesario'],
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        required: false
    },
    google: {
        type: Boolean,
        default: false
    },
    estadoDeportivo: {
        type: String,
        required: [false]
    },
    zona: {
        type: [Schema.Types.ObjectId],
        ref: 'Zona',
        required: [false, 'La zona es necesaria']
    }
}, userOptions);

// Método para no mostrar la password en la response
UserSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

// Muestra mensaje en la validación de unique
UserSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('User', UserSchema);