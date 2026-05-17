import bcrypt from 'bcrypt';

interface UserParams {
  nombre?: string;
  apellidos?: string;
  email?: string;
  password?: string;
  role?: string;
  estadoDeportivo?: string;
  zona?: any;
  club?: any;
}

let getPropiedadesComunesUsuario = (params: UserParams) => {
  return {
    nombre: params.nombre,
    apellidos: params.apellidos,
    email: params.email,
    password: bcrypt.hashSync(params.password || '', 10),
    role: params.role,
    estado: true,
    image: undefined,
    google: false,
    estadoDeportivo: params.estadoDeportivo,
    zona: params.zona,
    club: params.club
  };
};

let getPropiedadesAMostrarUsuario = () => [
  'nombre',
  'apellidos',
  'email',
  'estadoDeportivo',
  'zona',
  'estado'
];

let camposToUpdate = () => {
  return {
    camposComunes: ['nombre', 'apellidos', 'email', 'image', 'role', 'estado', 'club', 'zona'],
    camposJugador: ['estadoDeportivo', 'nombreDeportivo', 'fechaNacimiento', 'lateralidad', 'demarcacion', 'altura', 'peso'],
    camposEntrenador: ['estadoDeportivo', 'nombreDeportivo', 'entrenadorPorteros', 'titulacion', 'telefono']
  };
};

export {
  getPropiedadesComunesUsuario,
  getPropiedadesAMostrarUsuario,
  camposToUpdate
};
