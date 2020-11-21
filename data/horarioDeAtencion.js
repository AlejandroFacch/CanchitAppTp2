const fs = require('fs').promises;
const { ObjectID } = require('mongodb');
const connection = require('./conexionMongo');  


async function getHorarios(){
    const connectionMongo = await connection.getConnection();
    const horarios = await connectionMongo
                         .db('canchitAppDB')
                         .collection('horariosDeAtencion')
                         .findOne()
                         await connectionMongo.close();
     return horarios;
 }

 async function modificarHorarios (horario){
    const connectionMongo = await connection.getConnection();
    const horarioModificado = await connectionMongo
                         .db('canchitAppDB')
                         .collection('horariosDeAtencion')
                         .updateOne({}, horario);
                         await connectionMongo.close();
    return horarioModificado;
}


module.exports = {

    getHorarios,
    modificarHorarios
}