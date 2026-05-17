import bcrypt from 'bcrypt';
import _ from 'underscore';
import Entrenador from '../models/user-models/entrenador';
import { AppError } from '../middleware/errorHandler';

interface CreateEntrenadorParams {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  role: string;
  estadoDeportivo?: string;
  zona?: any;
  club?: any;
  nombreDeportivo?: string;
  entrenadorPorteros?: boolean;
  titulacion?: string[];
  telefono?: number;
}

export const getEntrenadores = async (desde = 0, limite = 20) => {
  const entrenadores = await Entrenador.find({ estado: true })
    .skip(Number(desde))
    .limit(Number(limite));

  const total = await Entrenador.countDocuments({});

  return { entrenadores, total };
};

export const searchEntrenadores = async (termino: string) => {
  const regex = new RegExp(termino, 'i');
  return await Entrenador.find({ nombre: regex });
};

export const getEntrenadorById = async (id: string) => {
  const entrenador = await Entrenador.findById(id)
    .populate({ path: 'zona' })
    .populate({ path: 'club' });

  if (!entrenador) {
    throw new AppError('Entrenador no encontrado', 404);
  }
  return entrenador;
};

export const getEntrenadoresByZona = async (idZona: string, desde = 0, limite = 5) => {
  const entrenadores = await Entrenador.find().populate({
    path: 'zona',
    match: { _id: { $eq: idZona } },
    select: 'nombreZona'
  }).skip(desde).limit(limite);

  return _.filter(entrenadores, e => e.zona !== null);
};

export const createEntrenador = async (params: CreateEntrenadorParams) => {
  const baseData = {
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

  const entrenador = new Entrenador({
    ...baseData,
    nombreDeportivo: params.nombreDeportivo,
    entrenadorPorteros: params.entrenadorPorteros || false,
    titulacion: params.titulacion,
    telefono: params.telefono
  });

  return await entrenador.save();
};

export const updateEntrenador = async (id: string, body: any) => {
  const camposComunes = ['nombre', 'apellidos', 'email', 'image', 'role', 'estado', 'club', 'zona'];
  const camposEntrenador = ['estadoDeportivo', 'nombreDeportivo', 'entrenadorPorteros', 'titulacion', 'telefono'];
  const camposActualizar = camposComunes.concat(camposEntrenador);

  const data = _.pick(body, camposActualizar);

  switch (data.role) {
    case 'JUGADOR_ROLE': data.usertype = 'Jugador'; break;
    case 'ENTRENADOR_ROLE': data.usertype = 'Entrenador'; break;
    case 'USER_ROLE': data.usertype = 'Usuario'; break;
  }

  const entrenador = await Entrenador.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!entrenador) {
    throw new AppError('Entrenador no encontrado', 404);
  }
  return entrenador;
};
