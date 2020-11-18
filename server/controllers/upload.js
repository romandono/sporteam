const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const User = require('../models/user');

let uploadFile = (req, res) => {

    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .send({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    let archivo = req.files.archivo;
    let nombreSpliteado = archivo.name.split('.');
    let extension = nombreSpliteado[nombreSpliteado.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).send({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    // Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/usuarios/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                err
            });
        }

        // Imagen cargada, actualización imagen usuario
        imagenUsuario(id, res, nombreArchivo);

    });

}

let imagenUsuario = (id, res, nombreArchivo) => {

    User.findById(id, (err, usuarioDB) => {
        if (err) {
            // Borrar imagen existente en fileSystem
            borrarArchivo(nombreArchivo);
            return res.status(500).send({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            // Borrar imagen existente en fileSystem
            borrarArchivo(nombreArchivo);
            return res.status(400).send({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        // Borrar imagen existente en fileSystem
        borrarArchivo(usuarioDB.image);

        usuarioDB.image = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.status(200).send({
                ok: true,
                usuario: usuarioGuardado,
                image: nombreArchivo
            });
        });
    });
}

let borrarArchivo = (nombreImagen) => {

    let pathUrlImage = path.resolve(__dirname, `../../uploads/usuarios/${nombreImagen}`);
    // Si ya existe la misma imagen la borramos del FileSystem
    if (fs.existsSync(pathUrlImage)) {
        fs.unlinkSync(pathUrlImage);
    }
}

module.exports = {
    uploadFile
};