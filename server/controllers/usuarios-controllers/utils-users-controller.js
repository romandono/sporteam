// Modules
const bcrypt = require('bcrypt');

/**
 * Devuelve un objeto con las propiedades comunes de los modelos usuario/jugador/entrenador
 * @param {*} params parámetros recibidos por request
 */
let getPropiedadesComunesUsuario = (params) => {
    return {
        nombre: params.nombre,
        apellido1: params.apellido1,
        apellido2: params.apellido2,
        email: params.email,
        password: bcrypt.hashSync(params.password, 10),
        role: params.role,
        estado: true,
        image: null,
        google: false,
        estadoDeportivo: params.estadoDeportivo,
        zona: params.zona
    }
}

/**
 * Método que devuelve los campos que son mostrados por la consulta GET
 */
let getPropiedadesAMostrarUsuario = () => ['nombre',
    'apellido1',
    'apellido2',
    'email',
    'estadoDeportivo',
    'zona'
]

/**
 * Método que devuelve los campos a actualizar de los usuarios PUT
 */

let camposToUpdate = () => {
    return {
        camposComunes: ['nombre', 'apellido1', 'apellido2', 'email', 'image', 'role', 'estado'],
        camposJugador: ['estadoDeportivo', 'nombreDeportivo', 'fechaNacimiento', 'lateralidad', 'demarcacion', 'altura', 'peso'],
        camposEntrenador: ['estadoDeportivo', 'nombreDeportivo', 'entrenadorPorteros', 'titulacion', 'telefono']
    }
}

module.exports = {
    getPropiedadesComunesUsuario,
    getPropiedadesAMostrarUsuario,
    camposToUpdate
}