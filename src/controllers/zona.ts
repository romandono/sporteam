import { Response } from 'express';
import Zona from '../models/zona';
import { AuthenticatedRequest } from '../types';

let getZonas = async(req: AuthenticatedRequest, res: Response) => {
  try {
    let zonas = await Zona.find({});

    if (!zonas) {
      return res.status(400).send({
        ok: false,
        message: 'No fue posible recuperar las zonas'
      });
    }

    res.json({
      ok: true,
      zonas
    });
  } catch (err) {
    res.status(400).send({
      ok: false,
      err
    });
  }
};

export {
  getZonas
};
