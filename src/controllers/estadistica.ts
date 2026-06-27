import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import * as estadisticaService from '../services/estadisticaService';
import { AppError } from '../middleware/errorHandler';

const asString = (v: string | string[] | undefined): string => Array.isArray(v) ? v[0] : (v || '');

let getEstadistica = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = asString(req.params.id);
    const estadistica = await estadisticaService.getEstadisticaById(id);

    res.status(200).json({ ok: true, estadistica });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ ok: false, message: err.message });
    }
    res.status(400).json({ ok: false, err });
  }
};

export { getEstadistica };
