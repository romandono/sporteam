import { Response } from 'express';
import Provincia from '../models/provincia';
import { AuthenticatedRequest } from '../types';

let getProvincias = (req: AuthenticatedRequest, res: Response) => {
  Provincia.find({})
    .exec((err, provincias) => {
      if (err) {
        return res.status(400).send({
          ok: false,
          err
        });
      }

      return res.status(200).send({
        ok: true,
        provincias
      });
    });
};

export {
  getProvincias
};
