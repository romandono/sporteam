'use strict'

var express = require('express');
var UserController = require('../controllers/users');

var api = express.Router();

api.get('/pruebas-del-controlador', UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.login);
api.put('/usuario/:id', UserController.updateUser);
api.get('/usuarios', UserController.getUsuarios);
api.delete('/usuario/:id', UserController.deleteUser);

module.exports = api;