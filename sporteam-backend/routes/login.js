const express = require('express');
const LoginController = require('../controllers/login');

var api = express.Router();

api.post('/login', LoginController.login);
api.post('/google', LoginController.loginGoogle);

module.exports = api;