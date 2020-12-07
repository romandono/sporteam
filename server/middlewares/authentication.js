const jwt = require('jsonwebtoken');

// =================
// Verificar Token
// =================
let verificarToken = (req, res, next) => {

    // Se recoge el header llamado token
    let token = req.get('token');

    if (!token) {
        return res.status(401).send({
            ok: false,
            message: 'No hay token en la petición'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if (err) {
            return res.status(401).send({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.id = decoded.id;
        next();

    });

};

// =================
// Verificar Rol
// =================
let verificarAdmin_Rol = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.rol === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

// =================
// Verificar usuario jugador
// =================
let verificarJugador_Rol = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.rol === 'JUGADOR_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es jugador'
            }
        });
    }
};

// =================
// Verificar usuario entrenador
// =================
let verificarEntrenador_Rol = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.rol === 'ENTRENADOR_ROL') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es entrenador'
            }
        });
    }
};

// =================
// Verificar Token imagen
// =================
let verificaTokenImage = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).send({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });
}

module.exports = {
    verificarToken,
    verificarAdmin_Rol,
    verificarJugador_Rol,
    verificarEntrenador_Rol,
    verificaTokenImage
}