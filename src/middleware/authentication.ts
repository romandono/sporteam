import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { AuthenticatedRequest, JwtPayload } from '../types';

const extractToken = (req: AuthenticatedRequest): string | undefined => {
  const authHeader = req.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return req.get('token');
};

let verificarToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token = extractToken(req);

  if (!token) {
    return res.status(401).send({
      ok: false,
      message: 'No hay token en la petición'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || '', (err, decoded) => {
    if (err) {
      return res.status(401).send({
        ok: false,
        err: { message: 'Token no válido' }
      });
    }

    const payload = decoded as JwtPayload;
    req.id = payload.id;

    prisma.user.findUnique({ where: { id: payload.id } })
      .then(usuario => {
        if (!usuario) {
          return res.status(401).send({
            ok: false,
            err: { message: 'Usuario no encontrado' }
          });
        }
        req.usuario = usuario;
        next();
      })
      .catch(error => {
        return res.status(500).send({
          ok: false,
          err: error
        });
      });
  });
};

let verificarAdmin_Rol = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let usuario = req.usuario;

  if (!usuario) {
    return res.status(401).json({
      ok: false,
      err: { message: 'Token no verificado' }
    });
  }

  if (usuario.role === 'ADMIN_ROLE') {
    next();
  } else {
    return res.json({
      ok: false,
      err: { message: 'El usuario no es administrador' }
    });
  }
};

let verificarJugador_Rol = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let usuario = req.usuario;

  if (!usuario) {
    return res.status(401).json({
      ok: false,
      err: { message: 'Token no verificado' }
    });
  }

  if (usuario.role === 'JUGADOR_ROLE') {
    next();
  } else {
    return res.json({
      ok: false,
      err: { message: 'El usuario no es jugador' }
    });
  }
};

let verificarEntrenador_Rol = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let usuario = req.usuario;

  if (!usuario) {
    return res.status(401).json({
      ok: false,
      err: { message: 'Token no verificado' }
    });
  }

  if (usuario.role === 'ENTRENADOR_ROLE') {
    next();
  } else {
    return res.json({
      ok: false,
      err: { message: 'El usuario no es entrenador' }
    });
  }
};

let verificaTokenImage = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token = req.query.token as string;

  jwt.verify(token, process.env.SEED || '', (err, decoded) => {
    if (err) {
      return res.status(401).send({
        ok: false,
        err: { message: 'Token no valido' }
      });
    }

    const payload = decoded as JwtPayload;
    req.usuario = payload;
    next();
  });
};

export {
  verificarToken,
  verificarAdmin_Rol,
  verificarJugador_Rol,
  verificarEntrenador_Rol,
  verificaTokenImage
};
