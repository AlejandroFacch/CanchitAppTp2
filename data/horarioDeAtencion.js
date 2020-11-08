const fs = require('fs').promises;
const { ObjectID } = require('mongodb');
const connection = require('./conexionMongo');  


async function getHorarios(){
    const connectionMongo = await connection.getConnection();
    const horarios = await connectionMongo
                         .db('canchitAppDB')
                         .collection('horariosDeAtencion')
                         .findOne()
     return horarios;
 }

 async function modificarHorarios (horario){
    const connectionMongo = await connection.getConnection();
    const usuarioModificado = await connectionMongo
                         .db('canchitAppDB')
                         .collection('horariosDeAtencion')
                         .updateOne(horario);
    return horarioModificado;
}


module.exports = {

    getHorarios,
    modificarHorarios
}