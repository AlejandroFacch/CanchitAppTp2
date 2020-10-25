const mongoose = require('mongoose')
//const {canchaSchema} = require('./cancha')
const {usuarioSchema} = require('./usuario')
const reservaSchema = new mongoose.Schema({
    //cancha que elija
    //datos del usuario
    //dia
    //horario  =>  enum: ['8-9', '9-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', 
    // '16-17', '17-18', '18-19', '19-20', '20-21', '21-22', '22-23', '23-00' ]
   
    usuario: {
        type: usuarioSchema,
        required: true
    },
    date:{type: Date, default: Date.now}
})

const Reserva = mongoose.model('reserva', reservaSchema)

module.exports = Reserva