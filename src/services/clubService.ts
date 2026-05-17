import _ from 'underscore';
import Club from '../models/club';
import { AppError } from '../middleware/errorHandler';

interface CreateClubParams {
  nombre: string;
  localidad?: string;
  provincia?: any;
  modalidad?: string;
  image?: string;
  zona?: any;
}

export const getClubs = async (desde = 0, limite = 5) => {
  const clubs = await Club.find({}).skip(Number(desde)).limit(Number(limite));
  const total = await Club.countDocuments();
  return { clubs, total };
};

export const searchClubs = async (termino: string) => {
  const regex = new RegExp(termino, 'i');
  return await Club.find({ nombre: regex })
    .populate({ path: 'provincia' })
    .populate({ path: 'zona' });
};

export const getClubById = async (id: string) => {
  const club = await Club.findById(id);
  if (!club) {
    throw new AppError('El club no existe en la base de datos', 404);
  }
  return club;
};

export const createClub = async (params: CreateClubParams) => {
  const club = new Club({
    nombre: params.nombre,
    localidad: params.localidad,
    provincia: params.provincia,
    modalidad: params.modalidad,
    image: params.image,
    zona: params.zona
  });

  return await club.save();
};

export const updateClub = async (id: string, body: any) => {
  const data = _.pick(body, ['nombre', 'localidad', 'provincia', 'modalidad', 'zona']);
  const club = await Club.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  if (!club) {
    throw new AppError('Club no encontrado', 404);
  }
  return club;
};

export const deleteClub = async (id: string) => {
  const club = await Club.findByIdAndDelete(id);
  if (!club) {
    throw new AppError('El club no está registrado', 404);
  }
  return club;
};

export const getClubsByZona = async (idZona: string, desde = 0, limite = 5) => {
  const clubs = await Club.find().populate({
    path: 'zona',
    match: { _id: { $eq: idZona } },
    select: 'nombreZona'
  }).skip(desde).limit(limite);

  return _.filter(clubs, c => c.zona !== null);
};
