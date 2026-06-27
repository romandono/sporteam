import { Response } from 'express';
import { AuthenticatedRequest } from '../../types';
import * as jugadorService from '../../services/jugadorService';
import { AppError } from '../../middleware/errorHandler';

const asString = (v: string | string[] | undefined): string => Array.isArray(v) ? v[0] : (v || '');
const asStringStrict = (v: string | string[]): string => Array.isArray(v) ? v[0] : v;

let getJugadores = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;
    const result = await jugadorService.getJugadores(desde, limite);

    res.status(200).send({ ok: true, ...result });
  } catch (err) {
    res.status(400).json({ ok: false, message: 'No se pudo recuperar ningún jugador.' });
  }
};

let getJugadoresBusqueda = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const termino = asString(req.params.termino);
    const resultados = await jugadorService.searchJugadores(termino);

    res.status(200).send({ ok: true, resultados });
  } catch (err) {
    res.status(400).json({ ok: false, message: 'No se pudo recuperar ningún jugador.' });
  }
};

let getJugador = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const jugador = await jugadorService.getJugadorById(asStringStrict(req.params.id));
    res.status(200).send({ ok: true, jugador });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ ok: false, message: err.message });
    }
    res.status(400).json({ ok: false, message: 'No se pudo recuperar ningún jugador.' });
  }
};

let getJugadoresPorZona = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const idZona = asStringStrict(req.params.idZona);
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;
    const result = await jugadorService.getJugadoresByZona(idZona, desde, limite);

    res.status(200).json({ ok: true, ...result });
  } catch (err) {
    res.status(500).json({ ok: false, err });
  }
};

let saveJugador = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const params = req.body;
    const jugador = await jugadorService.createJugador({
      nombre: params.nombre,
      apellidos: params.apellidos,
      email: params.email,
      password: params.password,
      role: params.role,
      estadoDeportivo: params.estadoDeportivo,
      zonas: params.zona,
      clubId: params.club,
      nombreDeportivo: params.nombreDeportivo,
      fechaNacimiento: params.fechaNacimiento,
      lateralidad: params.lateralidad,
      demarcacion: params.demarcacion,
      altura: params.altura,
      peso: params.peso
    });

    res.status(200).send({ ok: true, jugador });
  } catch (err: any) {
    res.status(400).send({ ok: false, err: err.message || err });
  }
};

let updateJugador = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const jugador = await jugadorService.updateJugador(asStringStrict(req.params.id), req.body);
    res.status(200).json({ ok: true, jugador });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ ok: false, err: { message: err.message } });
    }
    res.status(400).json({ ok: false, err });
  }
};

export { getJugadores, getJugador, saveJugador, updateJugador, getJugadoresPorZona, getJugadoresBusqueda };
