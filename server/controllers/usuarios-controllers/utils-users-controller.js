// Modules
const bcrypt = require('bcrypt');

// Metodo que recibe los parámetros de la request y los mapea en un modelo user/jugador/entrenador
let partesComunesUsuario = (params) => {
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

module.exports = {
    partesComunesUsuario
}