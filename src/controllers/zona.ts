import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import * as zonaService from '../services/zonaService';

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
  } catch (err) {
    res.status(400).send({ ok: false, err });
  }
};

export { getZonas };
