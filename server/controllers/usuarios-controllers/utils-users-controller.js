// Modules
const bcrypt = require('bcrypt');
var mongoose = require('mongoose');

/**
 * Devuelve un objeto con las propiedades comunes de los modelos usuario/jugador/entrenador
 * @param {*} params parámetros recibidos por request
 */
let getPropiedadesComunesUsuario = (params) => {
    return {
        nombre: params.nombre,
        apellidos: params.apellidos,
        email: params.email,
        password: bcrypt.hashSync(params.password, 10),
        role: params.role,
        estado: true,
        image: null,
        google: false,
        estadoDeportivo: params.estadoDeportivo,
        zona: params.zona,
        club: params.club
    }
}

/**
 * Método que devuelve los campos que son mostrados por la consulta GET
 */
let getPropiedadesAMostrarUsuario = () => [
    'nombre',
    'apellidos',
    'email',
    'estadoDeportivo',
    'zona',
    'estado'
]

/**
 * Método que devuelve los campos a actualizar de los usuarios PUT
 */

let camposToUpdate = () => {
    return {
        camposComunes: ['nombre', 'apellidos', 'email', 'image', 'role', 'estado', 'club', 'zona'],
        camposJugador: ['estadoDeportivo', 'nombreDeportivo', 'fechaNacimiento', 'lateralidad', 'demarcacion', 'altura', 'peso'],
        camposEntrenador: ['estadoDeportivo', 'nombreDeportivo', 'entrenadorPorteros', 'titulacion', 'telefono']
    }
}

module.exports = {
    getPropiedadesComunesUsuario,
    getPropiedadesAMostrarUsuario,
    camposToUpdate
}