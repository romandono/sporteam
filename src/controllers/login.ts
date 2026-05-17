import bcrypt from 'bcrypt';
import { Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user-models/user';
import { generarJWT } from '../helpers/jwt';
import { AuthenticatedRequest } from '../types';

const client = new OAuth2Client(process.env.CLIENT_ID);

let login = async(req: AuthenticatedRequest, res: Response) => {
  let body = req.body;

  const usuarioDB = await User.findOne({ email: body.email });

  if (!usuarioDB) {
    return res.status(400).json({
      ok: false,
      err: { message: 'Usuario o contraseña incorrectos' }
    });
  }

  if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
    return res.status(400).json({
      ok: false,
      err: { message: 'Usuario o contraseña incorrectos' }
    });
  }

  const token = await generarJWT(usuarioDB.id);

  res.json({
    ok: true,
    token
  });
};

interface GoogleUser {
  nombre: string;
  email: string;
  image: string;
  google: boolean;
}

let verify = async(token: string): Promise<GoogleUser> => {
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

let loginGoogle = async(req: AuthenticatedRequest, res: Response) => {
  let token = req.body.token;

  try {
    let googleUser = await verify(token);

    User.findOne({ email: googleUser.email }, async(err, usuarioDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if (usuarioDB) {
        if (usuarioDB.google === false) {
          return res.status(400).json({
            ok: false,
            err: { message: 'Debe usar su usuario de aplicación' }
          });
        }

        try {
          const jwtToken = await generarJWT(usuarioDB.id);
          return res.status(200).send({
            ok: true,
            token: jwtToken
          });
        } catch (err) {
          return res.status(400).send({
            ok: false,
            err
          });
        }
      }

      let usuario = new User();
      usuario.nombre = googleUser.nombre.split(' ')[0] || '';
      usuario.apellidos = (googleUser.nombre.split(' ')[1] || '') + ' ' + (googleUser.nombre.split(' ')[2] || '');
      usuario.email = googleUser.email;
      usuario.image = googleUser.image;
      usuario.google = true;
      usuario.password = ':)';
      usuario.role = 'USER_ROLE';

      usuario.save(async(err, usuarioCreado) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }

        try {
          const jwtToken = await generarJWT(usuarioCreado.id);
          return res.status(200).send({
            ok: true,
            token: jwtToken
          });
        } catch (err) {
          return res.status(400).send({
            ok: false,
            err
          });
        }
      });
    });
  } catch (e) {
    return res.status(403).send({
      ok: false,
      err: e
    });
  }
};

const renewToken = async(req: AuthenticatedRequest, res: Response) => {
  const id = req.id!;
  const token = await generarJWT(id);
  const usuario = await User.findById(id);

  res.json({
    ok: true,
    token,
    usuario
  });
};

export {
  login,
  loginGoogle,
  renewToken
};
