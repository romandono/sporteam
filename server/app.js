require('./config/config');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();

// cargar rutas
const user_routes = require('./routes/user-routes/usuario-route');
const jugadores_routes = require('./routes/user-routes/jugador-route');
const entrenadores_routes = require('./routes/user-routes/entrenador-route');
const login_routes = require('./routes/login');
const upload_routes = require('./routes/upload');
const provincias_routes = require('./routes/provincia');
const clubs_routes = require('./routes/club');
const zonas_routes = require('./routes/zona');
const estadisticas_routes = require('./routes/estadisitca');

// configurar cabeceras y cors
app.use(cors());

// middlewares de bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// habilitar carpeta public para probar login de google
// no se envía a producción
//app.use(express.static(path.resolve(__dirname, './public')));

// rutas base
app.use('/api', user_routes);
app.use('/api', login_routes);
app.use('/api', upload_routes);
app.use('/api', jugadores_routes);
app.use('/api', entrenadores_routes);
app.use('/api', provincias_routes);
app.use('/api', clubs_routes);
app.use('/api', zonas_routes);
app.use('/api', estadisticas_routes);

/* app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/index.html'));
}); */

module.exports = app;