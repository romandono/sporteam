const express = require('express');
const UserController = require('../../controllers/usuarios-controllers/users-controller');
const { verificarToken, verificarAdmin_Rol, verificaTokenImage } = require('../../middlewares/authentication');

const api = express.Router();


api.get('/usuarios', UserController.getUsuarios);
api.get('/usuario/:id', UserController.getUsuario);

api.post('/usuario', UserController.saveUser);

api.put('/usuario/:id', UserController.updateUser);

api.delete('/usuario/:id', UserController.deleteUser);

api.get('/usuario/image/:id', UserController.getUserImage);


module.exports = api;