import { Response } from 'express';
import _ from 'underscore';
import Club from '../models/club';
import { AuthenticatedRequest } from '../types';

const asString = (v: string | string[] | undefined): string => Array.isArray(v) ? v[0] : (v || '');

let getClubs = async(req: AuthenticatedRequest, res: Response) => {
  let desde = Number(req.query.desde) || 0;
  let limite = Number(req.query.limite) || 5;

  try {
    let clubs = await Club.find({}).skip(desde).limit(limite);
    let total = await Club.countDocuments();

    res.status(200).send({
      ok: true,
      clubs,
      total
    });
  } catch (err) {
    res.status(400).send({
      ok: false,
      err
    });
  }
};

let getClubsBusqueda = async(req: AuthenticatedRequest, res: Response) => {
  let termino = asString(req.params.termino);
  const regex = new RegExp(termino, 'i');

  try {
    let resultados = await Club.find({ nombre: regex })
      .populate({ path: 'provincia' })
      .populate({ path: 'zona' });

    res.status(200).send({
      ok: true,
      resultados
    });
  } catch (err) {
    res.status(400).send({
      ok: false,
      err
    });
  }
};

let getClub = async(req: AuthenticatedRequest, res: Response) => {
  let id = req.params.id;

  try {
    let club = await Club.findById(id);

    if (!club) {
      return res.status(404).send({
        ok: false,
        message: 'El club no existe en la base de datos'
      });
    }

    res.status(200).send({
      ok: true,
      club
    });
  } catch (err) {
    res.status(500).send({
      ok: false,
      err
    });
  }
};

let saveClub = (req: AuthenticatedRequest, res: Response) => {
  let body = req.body;

  let club = new Club({
    nombre: body.nombre,
    localidad: body.localidad,
    provincia: body.provincia,
    modalidad: body.modalidad,
    image: body.image,
    zona: body.zona
  });

  club.save((err, club) => {
    if (err) {
      return res.status(400).send({
        ok: false,
        err
      });
    }

    res.status(200).send({
      ok: true,
      club
    });
  });
};

let updateClub = (req: AuthenticatedRequest, res: Response) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'localidad', 'provincia', 'modalidad', 'zona']);

  Club.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true }, (err, clubDB) => {
    if (err) {
      return res.status(400).send({
        ok: false,
        err
      });
    }

    res.status(200).send({
      ok: true,
      club: clubDB
    });
  });
};

let getClubsPorZona = (req: AuthenticatedRequest, res: Response) => {
  let idZona = req.params.idZona;
  let desde = Number(req.query.desde) || 0;
  let limite = Number(req.query.limite) || 5;

  Club.find().populate({
    path: 'zona',
    match: { _id: { $eq: idZona } },
    select: 'nombreZona'
  }).skip(desde).limit(limite).exec((err, clubs) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    clubs = _.filter(clubs, (club) => {
      return club.zona !== null;
    });

    res.status(200).json({
      ok: true,
      clubs
    });
  });
};

let deleteClub = async(req: AuthenticatedRequest, res: Response) => {
  let id = req.params.id;

  try {
    let club = await Club.findByIdAndDelete(id);

    if (!club) {
      return res.status(404).send({
        ok: false,
        message: 'El club no está registrado'
      });
    }

    res.status(200).send({
      ok: true,
      message: 'Club eliminado'
    });
  } catch (err) {
    res.status(400).json({
      ok: false,
      message: 'No ha sido posible eliminar al club'
    });
  }
};

export {
  getClub,
  getClubs,
  saveClub,
  updateClub,
  getClubsPorZona,
  getClubsBusqueda,
  deleteClub
};
