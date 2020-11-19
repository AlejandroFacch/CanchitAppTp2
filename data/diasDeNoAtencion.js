const fs = require('fs').promises;
const { ObjectID } = require('mongodb');
const connection = require('./conexionMongo');  


async function getDias(){
    const connectionMongo = await connection.getConnection();
    const dias = await connectionMongo
                         .db('canchitAppDB')
                         .collection('diasDeNoAtencion')
                         .find()
                         .toArray();
                         await connectionMongo.close();
     return dias;
 }

 async function modificarDias (dia){
    const connectionMongo = await connection.getConnection();
    const diaModificado = await connectionMongo
                         .db('canchitAppDB')
                         .collection('diasDeNoAtencion')
                         .updateOne(dia);
                         await connectionMongo.close();
    return diaModificado;
}


module.exports = {

    getDias,
    modificarDias
}