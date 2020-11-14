const jwt = require('jsonwebtoken');

// =================
// Verificar Token
// =================
let verificarToken = (req, res, next) => {

    // Se recoge el header llamado token
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).send({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};

// =================
// Verificar Rol
// =================
let verificarAdmin_Rol = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
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


module.exports = {
    verificarToken,
    verificarAdmin_Rol
}