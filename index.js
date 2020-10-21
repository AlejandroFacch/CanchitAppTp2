const express = require('express')
const app = express()
const usuario = require('./routes/usuario')
app.use(express.json())
app.use('/api/usuarios', usuario)
const port = process.env.PORT || 3007
app.listen(port, () => console.log('Escuchando puerto: ' +port))

/*
const date = require('./date');
const morgan = require('morgan')
app.use(morgan('tiny'))
//middleware
//Te muestra el tiempo en milisegundos
app.use(date)
*/
//middleware
//Muestra el tipo de petición
/*app.use(function(req, res, next){
    console.log('Request Type: ', req.method)
    next()
})
//A este middleware le pasamos el endpoint donde queremos que muestre esta función
app.use('/api/clientes/list', function(req, res, next){
    console.log('Request Type: ', req.method)
    next()
})
*/
/*
app.use('/api/loggin', function(req, res, next){
    console.log('loggin')
    next()
})
app.get('/', function (req, res) {
  res.send('Hello World')
})
*/
//app.listen(port, () => console.log('Escuchando puerto: ' +port))