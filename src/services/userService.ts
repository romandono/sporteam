import bcrypt from 'bcrypt';
import _ from 'underscore';
import User from '../models/user-models/user';
import { AppError } from '../middleware/errorHandler';

interface CreateUserParams {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  role: string;
  estadoDeportivo?: string;
  zona?: any;
  club?: any;
}

export const getUsers = async (desde = 0, limite = 9) => {
  const usuarios = await User.find({ role: { $ne: 'ADMIN_ROLE' } })
    .skip(Number(desde))
    .limit(Number(limite));

  return {
    usuarios,
    total: usuarios.length
  };
};

export const getUserById = async (id: string) => {
  const usuario = await User.findById(id, ['nombre', 'apellidos', 'email', 'estadoDeportivo', 'zona', 'estado']);
  if (!usuario) {
    throw new AppError('Usuario no encontrado', 404);
  }
  return usuario;
};

export const createUser = async (params: CreateUserParams) => {
  const userData = {
    nombre: params.nombre,
    apellidos: params.apellidos,
    email: params.email,
    password: bcrypt.hashSync(params.password, 10),
    role: params.role,
    estado: true,
    image: undefined,
    google: false,
    estadoDeportivo: params.estadoDeportivo,
    zona: params.zona,
    club: params.club
  };

  const usuario = new User(userData);
  return await usuario.save();
};

export const updateUser = async (id: string, body: any) => {
  const data = _.pick(body, ['nombre', 'apellidos', 'email', 'image', 'role', 'estado', 'zona', 'estadoDeportivo', 'usertype', 'club']);

  switch (data.role) {
    case 'JUGADOR_ROLE': data.usertype = 'Jugador'; break;
    case 'ENTRENADOR_ROLE': data.usertype = 'Entrenador'; break;
    case 'USER_ROLE': data.usertype = 'Usuario'; break;
  }

  const usuario = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!usuario) {
    throw new AppError('Usuario no encontrado', 404);
  }
  return usuario;
};

export const deleteUser = async (id: string) => {
  const usuario = await User.findByIdAndDelete(id);
  if (!usuario) {
    throw new AppError('Usuario no encontrado', 400);
  }
  return usuario;
};
