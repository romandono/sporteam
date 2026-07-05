#!/usr/bin/env node
/**
 * Generates public/openapi.json from swagger-jsdoc annotations.
 * Run after changing routes or @openapi annotations.
 *
 * Usage: node scripts/generate-openapi.js
 */
const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sporteam API',
      version: '2.0.0',
      description: 'API RESTful para la gestión de jugadores, entrenadores y clubs de fútbol amateur',
      contact: { name: 'Roman Dono Perez' }
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Desarrollo' }
    ],
    components: {
      securitySchemes: {
        TokenAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'token',
          description: 'Token JWT de autenticación'
        }
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            ok: { type: 'boolean' },
            message: { type: 'string' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            ok: { type: 'boolean', example: false },
            err: {
              oneOf: [
                { type: 'string' },
                { type: 'object', properties: { message: { type: 'string' } } }
              ]
            },
            message: { type: 'string' }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nombre: { type: 'string' },
            apellidos: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['ADMIN_ROLE', 'USER_ROLE', 'JUGADOR_ROLE', 'ENTRENADOR_ROLE', 'CLUB_ROLE'] },
            estado: { type: 'boolean' },
            image: { type: 'string', nullable: true },
            google: { type: 'boolean' },
            estadoDeportivo: { type: 'string', nullable: true },
            clubId: { type: 'string', format: 'uuid', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CreateUserInput: {
          type: 'object',
          required: ['nombre', 'apellidos', 'email', 'password', 'role'],
          properties: {
            nombre: { type: 'string' },
            apellidos: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            role: { type: 'string', enum: ['USER_ROLE', 'JUGADOR_ROLE', 'ENTRENADOR_ROLE', 'CLUB_ROLE'] },
            estadoDeportivo: { type: 'string' },
            zona: { type: 'array', items: { type: 'string' }, description: 'Array de IDs de zona' },
            club: { type: 'string', description: 'ID del club' }
          }
        },
        Jugador: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nombre: { type: 'string' },
            apellidos: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string' },
            image: { type: 'string', nullable: true },
            estadoDeportivo: { type: 'string', nullable: true },
            clubId: { type: 'string', format: 'uuid', nullable: true },
            jugador: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nombreDeportivo: { type: 'string', nullable: true },
                fechaNacimiento: { type: 'string', format: 'date', nullable: true },
                lateralidad: { type: 'string', nullable: true },
                demarcacion: { type: 'array', items: { type: 'string' } },
                altura: { type: 'number', nullable: true },
                peso: { type: 'number', nullable: true }
              }
            },
            estadisticas: { type: 'array', items: { $ref: '#/components/schemas/Estadistica' } }
          }
        },
        JugadorInput: {
          type: 'object',
          required: ['nombre', 'apellidos', 'email', 'password'],
          properties: {
            nombre: { type: 'string' },
            apellidos: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            role: { type: 'string', enum: ['JUGADOR_ROLE'] },
            estadoDeportivo: { type: 'string' },
            zona: { type: 'array', items: { type: 'string' } },
            club: { type: 'string' },
            nombreDeportivo: { type: 'string' },
            fechaNacimiento: { type: 'string', format: 'date' },
            lateralidad: { type: 'string', enum: ['zurdo', 'diestro', 'ambidiestro'] },
            demarcacion: { type: 'array', items: { type: 'string' } },
            altura: { type: 'number' },
            peso: { type: 'number' }
          }
        },
        Entrenador: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nombre: { type: 'string' },
            apellidos: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string' },
            image: { type: 'string', nullable: true },
            estadoDeportivo: { type: 'string', nullable: true },
            clubId: { type: 'string', format: 'uuid', nullable: true },
            entrenador: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nombreDeportivo: { type: 'string', nullable: true },
                telefono: { type: 'string', nullable: true },
                entrenadorPorteros: { type: 'boolean' },
                titulacion: { type: 'array', items: { type: 'string' } }
              }
            }
          }
        },
        EntrenadorInput: {
          type: 'object',
          required: ['nombre', 'apellidos', 'email', 'password'],
          properties: {
            nombre: { type: 'string' },
            apellidos: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            role: { type: 'string', enum: ['ENTRENADOR_ROLE'] },
            estadoDeportivo: { type: 'string' },
            zona: { type: 'array', items: { type: 'string' } },
            club: { type: 'string' },
            nombreDeportivo: { type: 'string' },
            entrenadorPorteros: { type: 'boolean' },
            titulacion: { type: 'array', items: { type: 'string' } },
            telefono: { type: 'string' }
          }
        },
        Club: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nombre: { type: 'string' },
            localidad: { type: 'string', nullable: true },
            provinciaId: { type: 'string', format: 'uuid', nullable: true },
            modalidad: { type: 'string', nullable: true },
            image: { type: 'string', nullable: true },
            zonaId: { type: 'string', format: 'uuid', nullable: true },
            provincia: { $ref: '#/components/schemas/Provincia' },
            zona: { $ref: '#/components/schemas/Zona' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CreateClubInput: {
          type: 'object',
          required: ['nombre'],
          properties: {
            nombre: { type: 'string' },
            localidad: { type: 'string' },
            provincia: { type: 'string', description: 'ID de la provincia' },
            modalidad: { type: 'string' },
            image: { type: 'string' },
            zona: { type: 'string', description: 'ID de la zona' }
          }
        },
        Zona: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nombreZona: { type: 'string' }
          }
        },
        Provincia: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nombre: { type: 'string' }
          }
        },
        Estadistica: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            profileId: { type: 'string', format: 'uuid' },
            temporadaId: { type: 'string', format: 'uuid' },
            partidosJugados: { type: 'integer' },
            goles: { type: 'integer' },
            asistencias: { type: 'integer' },
            tarjetasAmarillas: { type: 'integer' },
            tarjetasRojas: { type: 'integer' },
            temporada: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                anho: { type: 'string' }
              }
            }
          }
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            ok: { type: 'boolean' },
            token: { type: 'string' },
            usuario: { $ref: '#/components/schemas/User' }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            ok: { type: 'boolean' },
            total: { type: 'integer' }
          }
        }
      }
    }
  },
  apis: [
    './src/routes/*.ts',
    './src/routes/user-routes/*.ts'
  ]
};

const swaggerSpec = swaggerJsdoc(options);
const outputPath = path.resolve(__dirname, '../public/openapi.json');

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), 'utf-8');
console.log('OpenAPI spec generada en ' + outputPath);