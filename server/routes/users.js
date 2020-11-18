'use strict'

var express = require('express');
var UserController = require('../controllers/usuarios-controllers/users-controller');
const { verificarToken, verificarAdmin_Rol, verificaTokenImage } = require('../middlewares/authentication');

var api = express.Router();

api.get('/pruebas-del-controlador', UserController.pruebas);
api.post('/register', UserController.saveUser);
api.put('/usuario/:id', verificarToken, UserController.updateUser);
api.get('/usuarios', verificarToken, UserController.getUsuarios);
api.delete('/usuario/:id', [verificarToken, verificarAdmin_Rol], UserController.deleteUser);
api.get('/usuario/image/:id', verificaTokenImage, UserController.getUserImage);

module.exports = api;