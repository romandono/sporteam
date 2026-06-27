import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import cloudinary from 'cloudinary';
import prisma from '../lib/prisma';
import { AuthenticatedRequest } from '../types';

const asString = (v: string | string[] | undefined): string => Array.isArray(v) ? v[0] : (v || '');

let uploadFile = async (req: AuthenticatedRequest, res: Response) => {
  const id = asString(req.params.id);
  const tipo = asString(req.params.tipo);

  if (!req.files) {
    return res.status(400).send({
      ok: false,
      err: { message: 'No se ha seleccionado ningún archivo' }
    });
  }

  const archivo = req.files.archivo as any;
  const nombreSpliteado = archivo.name.split('.');
  const extension = nombreSpliteado[nombreSpliteado.length - 1];

  const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).send({
      ok: false,
      err: {
        message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
        ext: extension
      }
    });
  }

  const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  await archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err: Error) => {
    if (err) {
      return res.status(500).send({ ok: false, err });
    }
  });

  cloudinary.v2.uploader.upload(`uploads/${tipo}/${nombreArchivo}`, { tags: `${tipo}` }, async (err: any, image: any) => {
    if (err) {
      return res.status(500).send({ ok: false, err });
    }

    switch (tipo) {
      case 'usuarios':
        await imagenUsuario(id, res, nombreArchivo, image.url);
        break;
      case 'clubs':
        await imagenClub(id, res, nombreArchivo, image.url);
        break;
    }
  });
};

let imagenUsuario = async (id: string, res: Response, nombreArchivo: string, urlImagen: string) => {
  try {
    const usuario = await prisma.user.findUnique({ where: { id } });

    if (!usuario) {
      borrarArchivo(nombreArchivo);
      return res.status(400).send({
        ok: false,
        err: { message: 'El usuario no existe' }
      });
    }

    borrarArchivo(usuario.image || '');

    const usuarioActualizado = await prisma.user.update({
      where: { id },
      data: { image: urlImagen }
    });

    res.status(200).send({
      ok: true,
      usuario: usuarioActualizado,
      image: urlImagen
    });
  } catch (err) {
    borrarArchivo(nombreArchivo);
    res.status(500).send({ ok: false, err });
  }
};

let imagenClub = async (id: string, res: Response, nombreArchivo: string, urlImagen: string) => {
  try {
    const club = await prisma.club.findUnique({ where: { id } });

    if (!club) {
      borrarArchivoClub(nombreArchivo);
      return res.status(400).send({
        ok: false,
        err: { message: 'El club no existe' }
      });
    }

    borrarArchivoClub(club.image || '');

    const clubActualizado = await prisma.club.update({
      where: { id },
      data: { image: urlImagen }
    });

    res.status(200).send({
      ok: true,
      club: clubActualizado,
      image: urlImagen
    });
  } catch (err) {
    borrarArchivoClub(nombreArchivo);
    res.status(500).send({ ok: false, err });
  }
};

let borrarArchivo = (nombreImagen: string) => {
  const pathUrlImage = path.resolve(__dirname, `../../uploads/usuarios/${nombreImagen}`);
  if (fs.existsSync(pathUrlImage)) {
    fs.unlinkSync(pathUrlImage);
  }
};

let borrarArchivoClub = (nombreImagen: string) => {
  const pathUrlImage = path.resolve(__dirname, `../../uploads/clubs/${nombreImagen}`);
  if (fs.existsSync(pathUrlImage)) {
    fs.unlinkSync(pathUrlImage);
  }
};

export { uploadFile };
