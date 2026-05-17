import bcrypt from 'bcrypt';
import _ from 'underscore';
import Jugador from '../models/user-models/jugador';
import { AppError } from '../middleware/errorHandler';

interface CreateJugadorParams {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  role: string;
  estadoDeportivo?: string;
  zona?: any;
  club?: any;
  nombreDeportivo?: string;
  fechaNacimiento?: string;
  lateralidad?: string;
  demarcacion?: string[];
  altura?: number;
  peso?: number;
}

export const getJugadores = async (desde = 0, limite = 5) => {
  const jugadores = await Jugador.find()
    .populate({ path: 'estadisticas' })
    .skip(Number(desde))
    .limit(Number(limite));

  const total = await Jugador.countDocuments({});

  return { jugadores, total };
};

export const searchJugadores = async (termino: string) => {
  const regex = new RegExp(termino, 'i');
  return await Jugador.find({ nombre: regex });
};

export const getJugadorById = async (id: string) => {
  const jugador = await Jugador.findById(id);
  if (!jugador) {
    throw new AppError('Jugador no encontrado', 404);
  }
  return jugador;
};

export const getJugadoresByZona = async (idZona: string, desde = 0, limite = 5) => {
  const jugadores = await Jugador.find().populate({
    path: 'zona',
    match: { _id: { $eq: idZona } },
    select: 'nombreZona'
  }).skip(desde).limit(limite);

  return _.filter(jugadores, j => j.zona !== null);
};

export const createJugador = async (params: CreateJugadorParams) => {
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

  const jugador = new Jugador({
    ...baseData,
    nombreDeportivo: params.nombreDeportivo,
    fechaNacimiento: params.fechaNacimiento,
    lateralidad: params.lateralidad,
    demarcacion: params.demarcacion,
    altura: params.altura,
    peso: params.peso
  });

  return await jugador.save();
};

export const updateJugador = async (id: string, body: any) => {
  const camposComunes = ['nombre', 'apellidos', 'email', 'image', 'role', 'estado', 'club', 'zona'];
  const camposJugador = ['estadoDeportivo', 'nombreDeportivo', 'fechaNacimiento', 'lateralidad', 'demarcacion', 'altura', 'peso'];
  const camposActualizar = camposComunes.concat(camposJugador);

  const data = _.pick(body, camposActualizar);

  switch (data.role) {
    case 'JUGADOR_ROLE': data.usertype = 'Jugador'; break;
    case 'ENTRENADOR_ROLE': data.usertype = 'Entrenador'; break;
    case 'USER_ROLE': data.usertype = 'Usuario'; break;
  }

  const jugador = await Jugador.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!jugador) {
    throw new AppError('Jugador no encontrado', 404);
  }
  return jugador;
};
