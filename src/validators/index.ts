import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'El email es obligatorio').isEmail(),
  body('password', 'La contraseña es obligatoria').not().isEmpty()
];

export const createUserValidation = [
  body('nombre', 'El nombre es obligatorio').not().isEmpty(),
  body('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
  body('email', 'Email inválido').isEmail(),
  body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  body('role', 'El rol es obligatorio').not().isEmpty()
];

export const createJugadorValidation = [
  body('nombre', 'El nombre es obligatorio').not().isEmpty(),
  body('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
  body('email', 'Email inválido').isEmail(),
  body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  body('role', 'El rol debe ser JUGADOR_ROLE').equals('JUGADOR_ROLE')
];

export const createEntrenadorValidation = [
  body('nombre', 'El nombre es obligatorio').not().isEmpty(),
  body('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
  body('email', 'Email inválido').isEmail(),
  body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  body('role', 'El rol debe ser ENTRENADOR_ROLE').equals('ENTRENADOR_ROLE')
];

export const createClubValidation = [
  body('nombre', 'El nombre es obligatorio').not().isEmpty()
];
