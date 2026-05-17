import _ from 'underscore';
import { Response } from 'express';
import Jugador from '../../models/user-models/jugador';
import { getPropiedadesAMostrarUsuario, getPropiedadesComunesUsuario, camposToUpdate } from './utils-users-controller';
import { AuthenticatedRequest } from '../../types';

const asString = (v: string | string[] | undefined): string => Array.isArray(v) ? v[0] : (v || '');

const camposAMostrar = getPropiedadesAMostrarUsuario();

let getJugadores = (req: AuthenticatedRequest, res: Response) => {
  let desde = req.query.desde || 0;
  let limite = req.query.limite || 5;

  Jugador.find()
    .populate({ path: 'estadisticas' })
    .exec((err, jugadores) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: 'No se pudo recuperar ningún jugador.'
        });
      }

      Jugador.countDocuments({}, (err, total) => {
        res.status(200).send({
          ok: true,
          jugadores,
          total
        });
      });
    });
};

let getJugadoresBusqueda = async(req: AuthenticatedRequest, res: Response) => {
  let termino = asString(req.params.termino);
  const regex = new RegExp(termino, 'i');

  Jugador.find({ nombre: regex })
    .exec((err, resultados) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: 'No se pudo recuperar ningún jugador.'
        });
      }

      res.status(200).send({
        ok: true,
        resultados
      });
    });
};

let getJugador = (req: AuthenticatedRequest, res: Response) => {
  let id = req.params.id;

  Jugador.findById(id, (err, jugador) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: 'No se pudo recuperar ningún jugador.'
      });
    }

    res.status(200).send({
      ok: true,
      jugador
    });
  });
};

let getJugadoresPorZona = (req: AuthenticatedRequest, res: Response) => {
  let idZona = req.params.idZona;
  let desde = Number(req.query.desde) || 0;
  let limite = Number(req.query.limite) || 5;

  Jugador.find().populate({
    path: 'zona',
    match: { _id: { $eq: idZona } },
    select: 'nombreZona'
  }).skip(desde).limit(limite).exec((err, jugadores) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    jugadores = _.filter(jugadores, (jugador) => {
      return jugador.zona !== null;
    });

    res.status(200).json({
      ok: true,
      jugadores
    });
  });
};

let saveJugador = (req: AuthenticatedRequest, res: Response) => {
  let params = req.body;
  let camposComunesUsuario = getPropiedadesComunesUsuario(params);

  let jugador = new Jugador({
    ...camposComunesUsuario,
    estadoDeportivo: params.estadoDeportivo,
    nombreDeportivo: params.nombreDeportivo,
    fechaNacimiento: params.fechaNacimiento,
    lateralidad: params.lateralidad,
    demarcacion: params.demarcacion,
    altura: params.altura,
    peso: params.peso
  });

  jugador.save((err, jugadorDB) => {
    if (err) {
      return res.status(400).send({
        ok: false,
        err
      });
    }

    res.status(200).send({
      ok: true,
      jugador: jugadorDB
    });
  });
};

let updateJugador = (req: AuthenticatedRequest, res: Response) => {
  let id = req.params.id;
  let camposActualizar = camposToUpdate().camposComunes.concat(camposToUpdate().camposJugador);
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

  Jugador.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, jugadorDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.status(200).send({
      ok: true,
      jugador: jugadorDB
    });
  });
};

export {
  getJugadores,
  getJugador,
  saveJugador,
  updateJugador,
  getJugadoresPorZona,
  getJugadoresBusqueda
};
