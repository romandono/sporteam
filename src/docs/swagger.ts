import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sporteam API',
      version: '2.0.0',
      description: 'API RESTful para la gestión de jugadores, entrenadores y clubs de fútbol amateur',
      contact: {
        name: 'Roman Dono Perez'
      }
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
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/routes/user-routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
