const mongoose = require('mongoose')

const usuarioSchema = new mongoose.Schema({
    dni:{
        type: Number,
        required: true
    },
    nombre:{
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        minlength: 3,
        maxlength: 30
        //enum: ['admin', 'other']
    },
    apellido:{
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        minlength: 3,
        maxlength: 30
        //enum: ['admin', 'other']
    },
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100
    },
    fecha_nacimiento:{
        type: Date,
        required: true
    },
    date:{type: Date, default: Date.now}
})

const Usuario = mongoose.model('usuario', usuarioSchema)

module.exports = Usuario