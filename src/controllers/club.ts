import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import * as clubService from '../services/clubService';
import { AppError } from '../middleware/errorHandler';

const asString = (v: string | string[] | undefined): string => Array.isArray(v) ? v[0] : (v || '');

let getClubs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;
    const result = await clubService.getClubs(desde, limite);

    res.status(200).send({ ok: true, ...result });
  } catch (err) {
    res.status(400).send({ ok: false, err });
  }
};

let getClubsBusqueda = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const termino = String(req.params.termino);
    const resultados = await clubService.searchClubs(termino);

    res.status(200).send({ ok: true, resultados });
  } catch (err) {
    res.status(400).send({ ok: false, err });
  }
};

let getClub = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const club = await clubService.getClubById(String(req.params.id));
    res.status(200).send({ ok: true, club });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).send({ ok: false, message: err.message });
    }
    res.status(500).send({ ok: false, err });
  }
};

let saveClub = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const body = req.body;
    const club = await clubService.createClub({
      nombre: body.nombre,
      localidad: body.localidad,
      provinciaId: body.provincia,
      modalidad: body.modalidad,
      image: body.image,
      zonaId: body.zona
    });

    res.status(200).send({ ok: true, club });
  } catch (err) {
    res.status(400).send({ ok: false, err });
  }
};

let updateClub = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const club = await clubService.updateClub(String(req.params.id), req.body);
    res.status(200).send({ ok: true, club });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).send({ ok: false, err: { message: err.message } });
    }
    res.status(400).send({ ok: false, err });
  }
};

let getClubsPorZona = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const idZona = String(req.params.idZona);
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;
    const result = await clubService.getClubsByZona(idZona, desde, limite);

    res.status(200).json({ ok: true, ...result });
  } catch (err) {
    res.status(500).json({ ok: false, err });
  }
};

let deleteClub = async (req: AuthenticatedRequest, res: Response) => {
  try {
    await clubService.deleteClub(String(req.params.id));
    res.status(200).send({ ok: true, message: 'Club eliminado' });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ ok: false, message: err.message });
    }
    res.status(400).json({ ok: false, message: 'No ha sido posible eliminar al club' });
  }
};

export { getClub, getClubs, saveClub, updateClub, getClubsPorZona, getClubsBusqueda, deleteClub };
