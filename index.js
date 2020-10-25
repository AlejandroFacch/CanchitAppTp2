const mongoose = require('mongoose')
const express = require('express')
const app = express()
const usuario = require('./routes/usuario')
app.use(express.json())
app.use('/api/usuarios/', usuario)
const port = process.env.PORT || 3007
app.listen(port, () => console.log('Escuchando puerto: ' +port))

mongoose.connect('mongodb://localhost/canchitApp', {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log('Conectado a MongoDb'))
    .catch(erro => console.log('No se ha conectado a MongoDb'))