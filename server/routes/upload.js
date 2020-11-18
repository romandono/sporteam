const express = require('express');
const fileUpload = require('express-fileupload');
const api = express();

// default options
api.use(fileUpload());

const UploadController = require('../controllers/upload');

api.put('/upload/:id', UploadController.uploadFile);

module.exports = api