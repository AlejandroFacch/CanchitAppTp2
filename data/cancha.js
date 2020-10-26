const fs = require('fs').promises;
const { ObjectID } = require('mongodb');
const connection = require('./conexionMongo');  


// GET todas las canchas de ese tipo
async function getCanchasSegunTipo(descripcion){
    const connectionMongo = await connection.getConnection();
    const canchas = await connectionMongo
                         .db('canchitAppDB')
                         .collection('canchas')
                         .find({descripcion: descripcion })
                         .toArray();
     return canchas;
 }

// GET todas las canchas
async function getCanchas(){
    const connectionMongo = await connection.getConnection();
    const canchas = await connectionMongo
                         .db('canchitAppDB')
                         .collection('canchas')
                         .find()
                         .toArray();
     return canchas;
 }




 // GET de una cancha en especifico
 async function getCancha(numero){
    const connectionMongo = await connection.getConnection();
    const cancha= await connectionMongo
                         .db('canchitAppDB')
                         .collection('canchas')
                         .findOne({numero: numero});
    return cancha;
}

// Borra una cancha en especifico
async function deleteCancha(id){
    const connectionMongo = await connection.getConnection();
    let mongoId = new ObjectID(id);
    const canchaBorrada = await connectionMongo.db('canchitAppDB')
                            .collection('canchas')
                            .deleteOne({_id: mongoId});
    return canchaBorrada;
}

// Agrega una sola cancha
async function agregarCancha (cancha){
    const connectionMongo = await connection.getConnection();
    const canchaAgregada = await connectionMongo
                         .db('canchitAppDB')
                         .collection('canchas')
                         .insertOne(cancha);
    return canchaAgregada;
}

// Agrega mas de una cancha del mismo tipo
async function agregarCanchas (canchas){
    const connectionMongo = await connection.getConnection();
    const canchasAgregadas = await connectionMongo
                         .db('canchitAppDB')
                         .collection('canchas')
                         .insertMany(canchas);
    return canchasAgregadas;
}

// verificarCancha revisa que el numero ingresado por cada cancha no coincida con alguna de la base, si no coincide devuelve existe en false
// si existe el numero en la base, retorna el numero existente en la base
async function verificarCancha (cancha){
    let existe = false;
    let c = await getCancha(cancha.numero)

    if(c != null){
        existe = true;
    }

    if(existe){
        existe = parseInt(cancha.numero);
    }
    return existe;
}








module.exports = {getCanchasSegunTipo, getCancha, deleteCancha, agregarCancha, agregarCanchas, getCanchas, verificarCancha}