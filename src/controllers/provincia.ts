import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import * as provinciaService from '../services/provinciaService';

let getProvincias = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const provincias = await provinciaService.getProvincias();
    res.status(200).send({ ok: true, provincias });
  } catch (err) {
    res.status(400).send({ ok: false, err });
  }
};

export { getProvincias };
