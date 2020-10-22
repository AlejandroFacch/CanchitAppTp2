const fs = require('fs').promises;
const { ObjectID } = require('mongodb');
const { parse } = require('path');
const connection = require('./conexionMongo');  

// GET todos los tipos de canchas
async function getAllTiposCanchas(){
    const connectionMongo = await connection.getConnection();
    const tiposCanchas = await connectionMongo
                         .db('canchitAppDB')
                         .collection('tipocancha')
                         .find()
                         .toArray();
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
    return tiposCanchas;
}

module.exports = {getAllTiposCanchas, getTipoCancha}