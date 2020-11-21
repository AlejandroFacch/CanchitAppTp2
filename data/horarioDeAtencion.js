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
    const modificaciones = {
        $set: {
            horarioDeInicio: horario.horarioDeInicio,
            horarioDeCierre: horario.horarioDeCierre,
        }
    }
    const horarioModificado = await connectionMongo
                         .db('canchitAppDB')
                         .collection('horariosDeAtencion')
                         .updateOne({}, modificaciones);
                         await connectionMongo.close();
    return horarioModificado;
}


module.exports = {

    getHorarios,
    modificarHorarios
}