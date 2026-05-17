import { Response } from 'express';
import Estadistica from '../models/estadistica';
import { AuthenticatedRequest } from '../types';

const asString = (v: string | string[] | undefined): string => Array.isArray(v) ? v[0] : (v || '');

let getEstadistica = (req: AuthenticatedRequest, res: Response) => {
  let id = asString(req.params.id);

  Estadistica.findById(id, (err, estadistica) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if (!estadistica) {
      return res.status(400).json({
        ok: false,
        message: 'No existe la estadistica'
      });
    }

    res.status(200).json({
      ok: true,
      estadistica
    });
  });
};

export {
  getEstadistica
};
