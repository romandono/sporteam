import fs from 'fs';
import path from 'path';
import { Response } from 'express';
import { AuthenticatedRequest } from '../../types';
import * as userService from '../../services/userService';
import { AppError } from '../../middleware/errorHandler';

let getUsuarios = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 9;
    const result = await userService.getUsers(desde, limite);

    res.status(200).send({ ok: true, ...result });
  } catch (err) {
    res.status(400).json({ ok: false, message: 'No se pudo recuperar ningún usuario' });
  }
};

let getUsuario = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const usuario = await userService.getUserById(String(req.params.id));
    res.status(200).send({ ok: true, usuario });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ ok: false, message: err.message });
    }
    res.status(400).json({ ok: false, message: 'No se pudo recuperar ningún usuario.' });
  }
};

let saveUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const params = req.body;
    const usuario = await userService.createUser({
      nombre: params.nombre,
      apellidos: params.apellidos,
      email: params.email,
      password: params.password,
      role: params.role,
      estadoDeportivo: params.estadoDeportivo,
      zonas: params.zona,
      clubId: params.club
    });
    res.status(200).send({ ok: true, usuario });
  } catch (err: any) {
    res.status(400).json({ ok: false, err: err.message || err });
  }
};

let updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const usuario = await userService.updateUser(String(req.params.id), req.body);
    res.status(200).send({ ok: true, usuario });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ ok: false, err: { message: err.message } });
    }
    res.status(400).json({ ok: false, err });
  }
};

let deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    await userService.deleteUser(String(req.params.id));
    res.status(200).send({ ok: true, message: 'Usuario eliminado' });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ ok: false, err: { message: err.message } });
    }
    res.status(400).json({ ok: false, err });
  }
};

let getUserImage = (req: AuthenticatedRequest, res: Response) => {
  const foto = req.params.foto;
  const tipo = req.params.tipo;
  const pathImage = path.resolve(__dirname, `../../../uploads/${tipo}/${foto}`);

  if (fs.existsSync(pathImage)) {
    res.sendFile(pathImage);
  } else {
    const pathNoImage = path.join(__dirname, `../../../uploads/${tipo}/no-image.jpg`);
    res.sendFile(pathNoImage);
  }
};

export { getUsuarios, getUsuario, saveUser, updateUser, deleteUser, getUserImage };
