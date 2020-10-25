const mongoose = require('mongoose')

const canchaSchema = new mongoose.Schema({
    //var nombre = canchas.length;
    nombre:{
        type: Number,
        required: true
    },
    capacidad:{
        type: Number,
        required: true
    },
    piso:{
        type: String,
        required: true
    },
    date:{type: Date, default: Date.now}
})

const Cancha = mongoose.model('cancha', canchaSchema)

module.exports = Cancha