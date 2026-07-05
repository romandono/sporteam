import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import * as zonaService from '../services/zonaService';
import logger from '../helpers/logger';

let getZonas = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const zonas = await zonaService.getZonas();

    if (!zonas) {
      return res.status(400).send({
        ok: false,
        message: 'No fue posible recuperar las zonas'
      });
    }

    res.json({ ok: true, zonas });
  } catch (err: any) {
    logger.error({ err, message: err?.message, code: err?.code, route: 'GET /zonas' }, 'Error al obtener zonas');
    res.status(400).send({ ok: false, message: err?.message || 'No fue posible recuperar las zonas' });
  }
};

export { getZonas };
