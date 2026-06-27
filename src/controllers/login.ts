import { Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { AuthenticatedRequest } from '../types';
import * as authService from '../services/authService';
import { AppError } from '../middleware/errorHandler';

const client = new OAuth2Client(process.env.CLIENT_ID);

let login = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const body = req.body;
    const result = await authService.loginUser(body.email, body.password);

    const { password, ...usuarioSinPassword } = result.usuario;
    res.json({ ok: true, token: result.token, usuario: usuarioSinPassword });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ ok: false, err: { message: err.message } });
    }
    res.status(500).json({ ok: false, err: { message: 'Error interno del servidor' } });
  }
};

interface GoogleUser {
  nombre: string;
  email: string;
  image: string;
  google: boolean;
}

let verify = async (token: string): Promise<GoogleUser> => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID
  });
  const payload = ticket.getPayload()!;

  return {
    nombre: payload.name || '',
    email: payload.email || '',
    image: payload.picture || '',
    google: true
  };
};

let loginGoogle = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const googleUser = await verify(req.body.token);
    const parts = googleUser.nombre.split(' ');
    const nombre = parts[0] || '';
    const apellidos = (parts[1] || '') + ' ' + (parts[2] || '');

    const result = await authService.loginGoogle(googleUser.email, nombre, apellidos.trim(), req.body.token);

    const { password, ...usuarioSinPassword } = result.usuario;
    res.status(200).send({
      ok: true,
      token: result.token,
      usuario: usuarioSinPassword
    });
  } catch (e: any) {
    if (e instanceof AppError) {
      return res.status(e.statusCode).json({ ok: false, err: { message: e.message } });
    }
    res.status(403).send({ ok: false, err: e });
  }
};

const renewToken = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.id!;
    const result = await authService.renewUserToken(id);
    const { password, ...usuarioSinPassword } = result.usuario;
    res.json({ ok: true, token: result.token, usuario: usuarioSinPassword });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ ok: false, err: { message: err.message } });
    }
    res.status(500).json({ ok: false, err: { message: 'Error interno del servidor' } });
  }
};

export { login, loginGoogle, renewToken };
