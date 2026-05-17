import _ from 'underscore';
import { Response } from 'express';
import Entrenador from '../../models/user-models/entrenador';
import { getPropiedadesAMostrarUsuario, getPropiedadesComunesUsuario, camposToUpdate } from './utils-users-controller';
import { AuthenticatedRequest } from '../../types';

const asString = (v: string | string[] | undefined): string => Array.isArray(v) ? v[0] : (v || '');

const camposAMostrar = getPropiedadesAMostrarUsuario();

let getEntrenadores = (req: AuthenticatedRequest, res: Response) => {
  let desde = req.query.desde || 0;
  let limite = req.query.limite || 20;

  Entrenador.find({ estado: true })
    .exec((err, entrenadores) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: 'No se pudo recuperar ningún entrenador.'
        });
      }

      Entrenador.countDocuments({}, (err, total) => {
        res.status(200).send({
          ok: true,
          entrenadores,
          total
        });
      });
    });
};

let getEntrenadoresBusqueda = (req: AuthenticatedRequest, res: Response) => {
  let termino = asString(req.params.termino);
  const regex = new RegExp(termino, 'i');

  Entrenador.find({ nombre: regex })
    .exec((err, resultados) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: 'No se pudo recuperar ningún entrenador.'
        });
      }

      res.status(200).send({
        ok: true,
        resultados
      });
    });
};

let getEntrenadoresPorZona = (req: AuthenticatedRequest, res: Response) => {
  let idZona = req.params.idZona;
  let desde = Number(req.query.desde) || 0;
  let limite = Number(req.query.limite) || 5;

  Entrenador.find().populate({
    path: 'zona',
    match: { _id: { $eq: idZona } },
    select: 'nombreZona'
  }).skip(desde).limit(limite).exec((err, entrenadores) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    entrenadores = _.filter(entrenadores, (entrenador) => {
      return entrenador.zona !== null;
    });

    res.status(200).json({
      ok: true,
      entrenadores
    });
  });
};

let getEntrenador = (req: AuthenticatedRequest, res: Response) => {
  let id = req.params.id;

  Entrenador.findById(id, (err, entrenador) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: 'No se pudo recuperar ningún entrenador.'
      });
    }

    res.status(200).send({
      ok: true,
      entrenador
    });
  }).populate({ path: 'zona' }).populate({ path: 'club' });
};

let saveEntrenador = (req: AuthenticatedRequest, res: Response) => {
  let params = req.body;
  let camposComunesUsuario = getPropiedadesComunesUsuario(params);

  let entrenador = new Entrenador({
    ...camposComunesUsuario,
    estadoDeportivo: params.estadoDeportivo,
    nombreDeportivo: params.nombreDeportivo,
    entrenadorPorteros: params.entrenadorPorteros,
    titulacion: params.titulacion,
    telefono: params.telefono
  });

  entrenador.save((err, entrenadorDB) => {
    if (err) {
      return res.status(400).send({
        ok: false,
        err
      });
    }

    res.status(200).send({
      ok: true,
      entrenador: entrenadorDB
    });
  });
};

let updateEntrenador = (req: AuthenticatedRequest, res: Response) => {
  let id = req.params.id;
  let camposActualizar = camposToUpdate().camposComunes.concat(camposToUpdate().camposEntrenador);
  let body = _.pick(req.body, camposActualizar);

  switch (body.role) {
    case 'JUGADOR_ROLE':
      body.usertype = 'Jugador';
      break;
    case 'ENTRENADOR_ROLE':
      body.usertype = 'Entrenador';
      break;
    case 'USER_ROLE':
      body.usertype = 'Usuario';
      break;
  }

  Entrenador.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, entrenadorDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.status(200).send({
      ok: true,
      entrenador: entrenadorDB
    });
  });
};

export {
  getEntrenadores,
  getEntrenador,
  saveEntrenador,
  updateEntrenador,
  getEntrenadoresPorZona,
  getEntrenadoresBusqueda
};
