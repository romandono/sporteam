const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const ZonaModel = require('../zona');
const ClubModel = require('../club');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'JUGADOR_ROLE', 'ENTRENADOR_ROLE', 'CLUB_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

const userOptions = {
    discriminatorKey: 'usertype',
    collection: 'users'
};

let UserSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellidos: {
        type: String,
        required: [true, 'Los apellidos son necesarios']
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
        required: false
    },
    zona: [{
        type: ZonaModel.schema,
        ref: 'Zona'
    }],
    club: {
        type: ClubModel.schema,
        ref: 'Club'
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
UserSchema.plugin(uniqueValidator, { message: 'El {PATH} ya está registrado' });

module.exports = mongoose.model('User', UserSchema);