const { response } = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const User = require('../models/user-models/user');
const Club = require('../models/club');

let uploadFile = (req, res) => {

    let id = req.params.id;
    let tipo = req.params.tipo;

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

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                err
            });
        }

        // Imagen cargada, actualización imagen usuario o club
        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;
            case 'clubs':
                imagenClub(id, res, nombreArchivo);
                break;
        }


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

let imagenClub = (id, res = response, nombreArchivo) => {
    Club.findById(id, (err, clubBD) => {
        if (err) {
            // Borrar imagen existente en fileSystem
            borrarArchivoClub(nombreArchivo);
            return res.status(500).send({
                ok: false,
                err
            });
        }

        if (!clubBD) {
            // Borrar imagen existente en fileSystem
            borrarArchivoClub(nombreArchivo);
            return res.status(400).send({
                ok: false,
                err: {
                    message: 'El club no existe'
                }
            });
        }

        // Borrar imagen existente en fileSystem
        borrarArchivoClub(clubBD.image);

        clubBD.image = nombreArchivo;

        clubBD.save((err, clubGuardado) => {
            res.status(200).send({
                ok: true,
                usuario: clubGuardado,
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

let borrarArchivoClub = (nombreImagen) => {

    let pathUrlImage = path.resolve(__dirname, `../../uploads/clubs/${nombreImagen}`);
    // Si ya existe la misma imagen la borramos del FileSystem
    if (fs.existsSync(pathUrlImage)) {
        fs.unlinkSync(pathUrlImage);
    }
}

module.exports = {
    uploadFile
};