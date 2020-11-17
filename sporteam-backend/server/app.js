'use strict'
require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// cargar rutas
const user_routes = require('./routes/users');
const login_routes = require('./routes/login');
const upload_routes = require('./routes/upload');
const jugadores_routes = require('./routes/jugador');
const entrenadores_routes = require('./routes/entrenador');

// middlewares de bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// habilitar carpeta public para probar login de google
// no se envía a producción
app.use(express.static(path.resolve(__dirname, '../public')));

// configurar cabeceras y cors

// rutas base
app.use('/api', user_routes);
app.use('/api', login_routes);
app.use('/api', upload_routes);
app.use('/api', jugadores_routes);
app.use('/api', entrenadores_routes);

module.exports = app;