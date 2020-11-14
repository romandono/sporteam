'use strict'

var express = require('express');
var UserController = require('../controllers/users');
const { verificarToken, verificarAdmin_Rol } = require('../middlewares/authentication');

var api = express.Router();

api.get('/pruebas-del-controlador', UserController.pruebas);
api.post('/register', UserController.saveUser);
api.put('/usuario/:id', verificarToken, UserController.updateUser);
api.get('/usuarios', verificarToken, UserController.getUsuarios);
api.delete('/usuario/:id', [verificarToken, verificarAdmin_Rol], UserController.deleteUser);

module.exports = api;