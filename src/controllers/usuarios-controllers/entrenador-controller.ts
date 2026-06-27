import { Response } from 'express';
import { AuthenticatedRequest } from '../../types';
import * as entrenadorService from '../../services/entrenadorService';
import { AppError } from '../../middleware/errorHandler';

const asString = (v: string | string[] | undefined): string => Array.isArray(v) ? v[0] : (v || '');
const asStringStrict = (v: string | string[]): string => Array.isArray(v) ? v[0] : v;

let getEntrenadores = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 20;
    const result = await entrenadorService.getEntrenadores(desde, limite);

    res.status(200).send({ ok: true, ...result });
  } catch (err) {
    res.status(400).json({ ok: false, message: 'No se pudo recuperar ningún entrenador.' });
  }
};

let getEntrenadoresBusqueda = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const termino = asString(req.params.termino);
    const resultados = await entrenadorService.searchEntrenadores(termino);

    res.status(200).send({ ok: true, resultados });
  } catch (err) {
    res.status(400).json({ ok: false, message: 'No se pudo recuperar ningún entrenador.' });
  }
};

let getEntrenadoresPorZona = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const idZona = asStringStrict(req.params.idZona);
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;
    const result = await entrenadorService.getEntrenadoresByZona(idZona, desde, limite);

    res.status(200).json({ ok: true, ...result });
  } catch (err) {
    res.status(500).json({ ok: false, err });
  }
};

let getEntrenador = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const entrenador = await entrenadorService.getEntrenadorById(asStringStrict(req.params.id));
    res.status(200).send({ ok: true, entrenador });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ ok: false, message: err.message });
    }
    res.status(400).json({ ok: false, message: 'No se pudo recuperar ningún entrenador.' });
  }
};

let saveEntrenador = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const params = req.body;
    const entrenador = await entrenadorService.createEntrenador({
      nombre: params.nombre,
      apellidos: params.apellidos,
      email: params.email,
      password: params.password,
      role: params.role,
      estadoDeportivo: params.estadoDeportivo,
      zonas: params.zona,
      clubId: params.club,
      nombreDeportivo: params.nombreDeportivo,
      entrenadorPorteros: params.entrenadorPorteros,
      titulacion: params.titulacion,
      telefono: params.telefono
    });

    res.status(200).send({ ok: true, entrenador });
  } catch (err: any) {
    res.status(400).send({ ok: false, err: err.message || err });
  }
};

let updateEntrenador = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const entrenador = await entrenadorService.updateEntrenador(asStringStrict(req.params.id), req.body);
    res.status(200).json({ ok: true, entrenador });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ ok: false, err: { message: err.message } });
    }
    res.status(400).json({ ok: false, err });
  }
};

export {
  getEntrenadores,
  getEntrenador,
  saveEntrenador,
  updateEntrenador,
  getEntrenadoresPorZona,
  getEntrenadoresBusqueda
};
