// Modules
const bcrypt = require('bcrypt');

let partesComunesUsuario = (params) => {
    return {
        nombre: params.nombre,
        apellido1: params.apellido1,
        apellido2: params.apellido2,
        email: params.email,
        image: null,
        password: bcrypt.hashSync(params.password, 10),
        role: params.role
    }
}

module.exports = {
    partesComunesUsuario
}