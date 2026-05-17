import _ from 'underscore';
import fs from 'fs';
import path from 'path';
import { Response } from 'express';
import User from '../../models/user-models/user';
import { AuthenticatedRequest } from '../../types';
import { getPropiedadesAMostrarUsuario, getPropiedadesComunesUsuario } from './utils-users-controller';

const camposAMostrar = getPropiedadesAMostrarUsuario();

let getUsuarios = (req: AuthenticatedRequest, res: Response) => {
  let desde = req.query.desde || 0;
  let limite = req.query.limite || 9;

  User.find({ role: { $ne: 'ADMIN_ROLE' } })
    .skip(Number(desde))
    .limit(Number(limite))
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: 'No se pudo recuperar ningún usuario'
        });
      }

      res.status(200).send({
        ok: true,
        usuarios,
        total: usuarios.length
      });
    });
};

let getUsuario = (req: AuthenticatedRequest, res: Response) => {
  let id = req.params.id;

  User.findById(id, camposAMostrar, (err, usuario) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: 'No se pudo recuperar ningún usuario.'
      });
    }

    res.status(200).send({
      ok: true,
      usuario
    });
  });
};

let saveUser = (req: AuthenticatedRequest, res: Response) => {
  let params = req.body;
  let camposComunesUsuario = getPropiedadesComunesUsuario(params);
  let usuario = new User(camposComunesUsuario);

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.status(200).send({
      ok: true,
      usuario: usuarioDB
    });
  });
};

let updateUser = async(req: AuthenticatedRequest, res: Response) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'apellidos', 'email', 'image', 'role', 'estado', 'zona', 'estadoDeportivo', 'usertype', 'club']);

  switch (body.role) {
    case 'JUGADOR_ROLE':
      body.usertype = 'Jugador';
      break;
    case 'ENTRENADOR_ROLE':
      body.usertype = 'Entrenador';
      break;
    case 'USER_ROLE':
      body.usertype = 'Usuario';
      break;
  }

  User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.status(200).send({
      ok: true,
      usuario: usuarioDB
    });
  });
};

let deleteUser = (req: AuthenticatedRequest, res: Response) => {
  let id = req.params.id;

  User.findByIdAndDelete(id, (err, usuarioBorrado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        err: { message: 'El usuario no existe' }
      });
    }

    res.status(200).send({
      ok: true,
      message: 'Usuario eliminado'
    });
  });
};

let getUserImage = (req: AuthenticatedRequest, res: Response) => {
  let foto = req.params.foto;
  let tipo = req.params.tipo;

  let pathImage = path.resolve(__dirname, `../../../uploads/${tipo}/${foto}`);

  if (fs.existsSync(pathImage)) {
    res.sendFile(pathImage);
  } else {
    const pathNoImage = path.join(__dirname, `../../../uploads/${tipo}/no-image.jpg`);
    res.sendFile(pathNoImage);
  }
};

export {
  getUsuarios,
  getUsuario,
  saveUser,
  updateUser,
  deleteUser,
  getUserImage
};
