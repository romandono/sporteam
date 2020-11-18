'use strict'

var mongoose = require('mongoose');
var app = require('./server/app');
var port = process.env.PORT;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://sporteam-01112020:EX39McyB@cluster0.lokgx.mongodb.net/sporteam?retryWrites=true&w=majority', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        console.log('La conexión a la base de datos sporteam se ha realizado correctamente...');

        app.listen(port, () => {
            console.log('El servidor local con Node y Express está corriendo correctamente...');
        });
    })
    .catch(err => console.log(err));