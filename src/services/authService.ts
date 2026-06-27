import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { generarJWT } from '../helpers/jwt';
import { AppError } from '../middleware/errorHandler';

export const loginUser = async (email: string, password: string) => {
  const usuarioDB = await prisma.user.findUnique({ where: { email } });
  if (!usuarioDB) {
    throw new AppError('Usuario o contraseña incorrectos', 400);
  }

  if (!bcrypt.compareSync(password, usuarioDB.password)) {
    throw new AppError('Usuario o contraseña incorrectos', 400);
  }

  const token = await generarJWT(usuarioDB.id);
  return { token, usuario: usuarioDB };
};

export const renewUserToken = async (id: string) => {
  const usuario = await prisma.user.findUnique({
    where: { id },
    include: { jugador: true, entrenador: true }
  });
  if (!usuario) {
    throw new AppError('Usuario no encontrado', 404);
  }

  const token = await generarJWT(id);
  return { token, usuario };
};

export const loginGoogle = async (email: string, nombre: string, apellidos: string, googleToken: string) => {
  let usuario = await prisma.user.findUnique({ where: { email } });

  if (!usuario) {
    usuario = await prisma.user.create({
      data: {
        nombre,
        apellidos,
        email,
        password: ':)',
        google: true,
        role: 'USER_ROLE',
        estado: true
      }
    });
  } else {
    if (!usuario.google) {
      throw new AppError('Debe usar su autenticación habitual', 400);
    }
  }

  const token = await generarJWT(usuario.id);
  return { token, usuario };
};
