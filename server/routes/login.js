const express = require('express');
const LoginController = require('../controllers/login');
const { verificarToken } = require('../middlewares/authentication');

var api = express.Router();

api.post('/login', LoginController.login);
api.post('/google', LoginController.loginGoogle);

api.get('/login/renew', [verificarToken], LoginController.renewToken);

module.exports = api;