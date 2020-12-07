const mongoose = require('mongoose');
const colors = require('colors/safe');

const app = require('./server/app');

const port = process.env.PORT;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_CNN, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {

        console.log(colors.green('Base de datos conectada'));

        app.listen(port, () => {
            console.log(colors.green(`Servidor esuchando en el puerto ${port}`));
        });
    })
    .catch(err => console.log(err));