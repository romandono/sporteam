'use strict'
require('./config/config');

var express = require('express');
var bodyParser = require('body-parser');
const path = require('path');

var app = express();

// cargar rutas
const user_routes = require('./routes/users');
const login_routes = require('./routes/login');

// middlewares de bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// habilitar carpeta public para probar login de google
// no se envía a producción
app.use(express.static(path.resolve(__dirname, './public')));

// configurar cabeceras y cors

// rutas base
app.use('/api', user_routes);
app.use('/api', login_routes);

app.get('/probando', (req, res) => {
    res.status(200).send({ message: 'Este es el método probando' });
});

module.exports = app;