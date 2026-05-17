import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import cloudinary from 'cloudinary';
import User from '../models/user-models/user';
import Club from '../models/club';
import { AuthenticatedRequest } from '../types';

const asString = (v: string | string[] | undefined): string => Array.isArray(v) ? v[0] : (v || '');

let uploadFile = async(req: AuthenticatedRequest, res: Response) => {
  let id = asString(req.params.id);
  let tipo = asString(req.params.tipo);

  if (!req.files) {
    return res.status(400).send({
      ok: false,
      err: { message: 'No se ha seleccionado ningún archivo' }
    });
  }

  let archivo = req.files.archivo as any;
  let nombreSpliteado = archivo.name.split('.');
  let extension = nombreSpliteado[nombreSpliteado.length - 1];

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

  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  await archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err: Error) => {
    if (err) {
      return res.status(500).send({
        ok: false,
        err
      });
    }
  });

  cloudinary.v2.uploader.upload(`uploads/${tipo}/${nombreArchivo}`, { tags: `${tipo}` }, function(err: any, image: any) {
    if (err) {
      return res.status(500).send({
        ok: false,
        err
      });
    }

    switch (tipo) {
      case 'usuarios':
        imagenUsuario(id, res, nombreArchivo, image.url);
        break;
      case 'clubs':
        imagenClub(id, res, nombreArchivo, image.url);
        break;
    }
  });
};

let imagenUsuario = (id: string, res: Response, nombreArchivo: string, urlImagen: string) => {
  User.findById(id, (err, usuarioDB) => {
    if (err) {
      borrarArchivo(nombreArchivo);
      return res.status(500).send({
        ok: false,
        err
      });
    }

    if (!usuarioDB) {
      borrarArchivo(nombreArchivo);
      return res.status(400).send({
        ok: false,
        err: { message: 'El usuario no existe' }
      });
    }

    borrarArchivo(usuarioDB.image || '');

    usuarioDB.image = urlImagen;

    usuarioDB.save((err, usuarioGuardado) => {
      res.status(200).send({
        ok: true,
        usuario: usuarioGuardado,
        image: urlImagen
      });
    });
  });
};

let imagenClub = (id: string, res: Response, nombreArchivo: string, urlImagen: string) => {
  Club.findById(id, (err, clubBD) => {
    if (err) {
      borrarArchivoClub(nombreArchivo);
      return res.status(500).send({
        ok: false,
        err
      });
    }

    if (!clubBD) {
      borrarArchivoClub(nombreArchivo);
      return res.status(400).send({
        ok: false,
        err: { message: 'El club no existe' }
      });
    }

    borrarArchivoClub(clubBD.image || '');

    clubBD.image = urlImagen;

    clubBD.save((err, clubGuardado) => {
      res.status(200).send({
        ok: true,
        club: clubGuardado,
        image: urlImagen
      });
    });
  });
};

let borrarArchivo = (nombreImagen: string) => {
  let pathUrlImage = path.resolve(__dirname, `../../uploads/usuarios/${nombreImagen}`);
  if (fs.existsSync(pathUrlImage)) {
    fs.unlinkSync(pathUrlImage);
  }
};

let borrarArchivoClub = (nombreImagen: string) => {
  let pathUrlImage = path.resolve(__dirname, `../../uploads/clubs/${nombreImagen}`);
  if (fs.existsSync(pathUrlImage)) {
    fs.unlinkSync(pathUrlImage);
  }
};

export {
  uploadFile
};
