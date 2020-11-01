const fs = require('fs').promises;
const { ObjectID } = require('mongodb');
const connection = require('./conexionMongo');  

// GET todos las reservas
async function getReservas(){
    const connectionMongo = await connection.getConnection();
    const reservas = await connectionMongo
                         .db('canchitAppDB')
                         .collection('reservas')
                         .find()
                         .toArray();
     return reservas;
 }
//Se utilizará para hacer una verificación cuando se reserve para evitar duplicaciones
//Entre el momento en que pide los turnos disponibles y el momento en que reserva, 
//otro usuario puede hacer la misma reserva.
 async function chequeoReserva(reserve){
    const connectionMongo = await connection.getConnection();
    const reserva = await connectionMongo
                         .db('canchitAppDB')
                         .collection('reservas')
                         .findOne({nroCancha: reserve.nroCancha, hora: reserve.hora, dia: reserve.dia})
     return reserva;
 }

 // GET de una reserva en especifica
 async function getReserva(id){
    const connectionMongo = await connection.getConnection();
    let mongoId = new ObjectID(id);
    const reserva= await connectionMongo
                         .db('canchitAppDB')
                         .collection('reservas')
                         .findOne({ _id: mongoId });
    return reserva;
}

// Borra una reserva en especifica
async function deleteReserva(id){
    const connectionMongo = await connection.getConnection();
    let mongoId = new ObjectID(id);
    const reservaEliminada = await connectionMongo.db('canchitAppDB')
                            .collection('reservas')
                            .deleteOne({_id: mongoId});
    return reservaEliminada;
}

// Agrega una sola reserca
async function agregarReserva (reserva){
    const connectionMongo = await connection.getConnection();
    const reservaAgregada = await connectionMongo
                         .db('canchitAppDB')
                         .collection('reservas')
                         .insertOne(reserva);
    return reservaAgregada;
}

// Modificar una sola reserva
async function modificarReserva (reserva){
    const connectionMongo = await connection.getConnection();
    const reservaModificada = await connectionMongo
                         .db('canchitAppDB')
                         .collection('reservas')
                         .updateOne(reserva);
    return reservaModificada;
}

// Verificar reserva
/* async function verificarReserva (reserva) {
    let existe = false;
    let miReserva = await getReserva(reserva.id);
    if(miReserva != null){
        existe = true;
    }
    return existe;
} */


module.exports = {
  getReservas,
  getReserva,
  chequeoReserva,
  deleteReserva,
  agregarReserva,
  modificarReserva,
};
