# Sporteam API

API RESTful para la gestión de información de jugadores, equipos y entrenadores de fútbol amateur. Backend construido con Node.js, Express, TypeScript y MongoDB.

## Stack

- **Runtime:** Node.js 18+
- **Lenguaje:** TypeScript 6
- **Framework:** Express 4
- **Base de datos:** MongoDB + Mongoose 5
- **Autenticación:** JWT + Google OAuth
- **Almacenamiento:** Local + Cloudinary

## Requisitos

- Node.js 18+
- MongoDB 6+ (o Docker)
- npm

## Instalación

```bash
git clone <repo-url>
cd sporteam
npm install
```

## Configuración

Copia el archivo `.env` en la raíz del proyecto:

```env
PORT=3000
DB_CNN=mongodb://localhost:27017/sporteam
JWT_SECRET=tu-secret-key
CLIENT_ID=tu-google-client-id
CLOUDINARY_URL=cloudinary://api-key:api-secret@cloud-name
```

## Desarrollo

```bash
# Desarrollo con recarga automática
npm run dev:watch

# Desarrollo simple
npm run dev
```

## Producción

```bash
# Compilar TypeScript
npm run build

# Iniciar servidor
npm start
```

## Tests

```bash
# Ejecutar tests
npm test

# Con cobertura
npm run test:cobertura

# En modo watch
npm run test:watch
```

## Docker

```bash
# Construir y levantar servicios (app + MongoDB)
docker-compose up --build

# Solo construir imagen
docker build -t sporteam-backend .
```

## API Endpoints

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/login` | Inicio de sesión (email + password) |
| POST | `/api/google` | Inicio de sesión con Google |
| GET | `/api/login/renew` | Renovar token JWT |

### Usuarios
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/usuarios` | Listar usuarios |
| GET | `/api/usuario/:id` | Obtener usuario por ID |
| POST | `/api/usuario` | Crear usuario |
| PUT | `/api/usuario/:id` | Actualizar usuario |
| DELETE | `/api/usuario/:id` | Eliminar usuario |

### Jugadores
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/jugadores` | Listar jugadores |
| GET | `/api/jugadores/:termino` | Buscar jugadores |
| GET | `/api/jugador/:id` | Obtener jugador |
| POST | `/api/jugador` | Crear jugador |
| PUT | `/api/jugador/:id` | Actualizar jugador |
| GET | `/api/jugadores/zona/:idZona` | Jugadores por zona |

### Entrenadores
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/entrenadores` | Listar entrenadores |
| GET | `/api/entrenadores/:termino` | Buscar entrenadores |
| GET | `/api/entrenador/:id` | Obtener entrenador |
| POST | `/api/entrenador` | Crear entrenador |
| PUT | `/api/entrenador/:id` | Actualizar entrenador |
| GET | `/api/entrenadores/zona/:idZona` | Entrenadores por zona |

### Clubs
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/clubs` | Listar clubs |
| GET | `/api/clubs/:termino` | Buscar clubs |
| GET | `/api/club/:id` | Obtener club |
| POST | `/api/club` | Crear club |
| PUT | `/api/club/:id` | Actualizar club |
| DELETE | `/api/club/:id` | Eliminar club |
| GET | `/api/clubs/zona/:idZona` | Clubs por zona |

### Otros
| Método | Ruta | Descripción |
|--------|------|-------------|
| PUT | `/api/upload/:tipo/:id` | Subir imagen |
| GET | `/api/provincias` | Listar provincias |
| GET | `/api/zonas` | Listar zonas |
| GET | `/api/estadistica/:id` | Obtener estadísticas |

## Licencia

MIT
