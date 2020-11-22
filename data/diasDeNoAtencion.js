const fs = require('fs').promises;
const { ObjectID } = require('mongodb');
const connection = require('./conexionMongo');  


async function getDias(){
    const connectionMongo = await connection.getConnection();
    const dias = await connectionMongo
                         .db('canchitAppDB')
                         .collection('diasDeNoAtencion')
                         .find();
                         await connectionMongo.close();
     return dias;
 }

 async function modificarDias (dias){
    const connectionMongo = await connection.getConnection();
    const modificaciones = {
        $set: {
            dias: dias
        }
    }
    const diaModificado = await connectionMongo
                         .db('canchitAppDB')
                         .collection('diasDeNoAtencion')
                         .updateOne({},modificaciones);
                         await connectionMongo.close();
    return diaModificado;
}


module.exports = {

    getDias,
    modificarDias
}