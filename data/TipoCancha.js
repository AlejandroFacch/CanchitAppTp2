const fs = require('fs').promises;
const { ObjectID } = require('mongodb');
const connection = require('./conexionMongo');  

// GET todos los tipos de canchas
async function getAllTiposCanchas(){
    const connectionMongo = await connection.getConnection();
    const tiposCanchas = await connectionMongo
                         .db('canchitAppDB')
                         .collection('tipocancha')
                         .find()
                         .toArray();
                         await connectionMongo.close();
     return tiposCanchas;
 }

 // GET de un tipo de cancha
 async function getTipoCancha(id){
    const connectionMongo = await connection.getConnection();
    let mongoId = new ObjectID(id);
    const tiposCanchas= await connectionMongo
                         .db('canchitAppDB')
                         .collection('tipocancha')
                         .findOne({_id: mongoId });
                         await connectionMongo.close();
    return tiposCanchas;
}

module.exports = { getAllTiposCanchas, getTipoCancha };