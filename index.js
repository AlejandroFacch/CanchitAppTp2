const mongoose = require('mongoose')
const express = require('express')
const app = express()
const usuario = require('./routes/usuario-ejemplo')
const reserva = require('./routes/reserva')
app.use(express.json())
app.use('/api/usuarios/', usuario)
app.use('/api/reservas/', reserva)
const port = process.env.PORT || 3007
app.listen(port, () => console.log('Escuchando puerto: ' +port))

mongoose.connect('mongodb://localhost/canchitApp', {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log('Conectado a MongoDb'))
    .catch(erro => console.log('No se ha conectado a MongoDb'))