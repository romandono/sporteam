import bcrypt from 'bcrypt';
import User from '../models/user-models/user';
import { generarJWT } from '../helpers/jwt';
import { AppError } from '../middleware/errorHandler';

export const loginUser = async (email: string, password: string) => {
  const usuarioDB = await User.findOne({ email });
  if (!usuarioDB) {
    throw new AppError('Usuario o contraseña incorrectos', 400);
  }

  if (!bcrypt.compareSync(password, usuarioDB.password)) {
    throw new AppError('Usuario o contraseña incorrectos', 400);
  }

  const token = await generarJWT(usuarioDB.id);
  return { token };
};

export const renewUserToken = async (id: string) => {
  const usuario = await User.findById(id);
  if (!usuario) {
    throw new AppError('Usuario no encontrado', 404);
  }

  const token = await generarJWT(id);
  return { token, usuario };
};
