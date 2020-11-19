const fs = require('fs').promises;
const { ObjectID } = require('mongodb');
const connection = require('./conexionMongo');


// GET todas las canchas de ese tipo
async function getCanchasSegunTipo(descripcion) {
    const connectionMongo = await connection.getConnection();
    const canchas = await connectionMongo
        .db('canchitAppDB')
        .collection('canchas')
        .find({ descripcion: descripcion })
        .toArray();
        await connectionMongo.close();
    return canchas;
}

// GET todas las canchas
async function getCanchas() {
    const connectionMongo = await connection.getConnection();
    var mysort = { numero: 1 };
    const canchas = await connectionMongo
        .db('canchitAppDB')
        .collection('canchas')
        .find()
        .sort(mysort)
        .toArray();
        await connectionMongo.close();
    return canchas;
}




// GET de una cancha en especifico
async function getCancha(numero) {
    const connectionMongo = await connection.getConnection();
    const cancha = await connectionMongo
        .db('canchitAppDB')
        .collection('canchas')
        .findOne({ numero: numero });
        await connectionMongo.close();
    return cancha;
}

// Modificación de una cancha en especifico
async function modificarCancha(cancha) {
    const connectionMongo = await connection.getConnection();
    let mongoId = new ObjectID(cancha.id);
    const modificaciones = {
        $set: {
            descripcion: cancha.descripcion,
            numero: cancha.numero,
            precio: cancha.precio
        }
    }
    const canchaModificada = await connectionMongo
        .db('canchitAppDB')
        .collection('canchas')
        .updateOne({ _id: mongoId }, modificaciones);
        await connectionMongo.close();
    return canchaModificada;
}

// Borra una cancha en especifico
async function deleteCancha(id) {
    const connectionMongo = await connection.getConnection();
    let mongoId = new ObjectID(id);
    const canchaBorrada = await connectionMongo.db('canchitAppDB')
        .collection('canchas')
        .deleteOne({ _id: mongoId });
        await connectionMongo.close();
    return canchaBorrada;
}

// Agrega una sola cancha
async function agregarCancha(cancha) {
    const connectionMongo = await connection.getConnection();
    cancha.numero=Number(cancha.numero)
    const canchaAgregada = await connectionMongo
        .db('canchitAppDB')
        .collection('canchas')
        .insertOne(cancha);
        await connectionMongo.close();
    return canchaAgregada;
}

// Agrega mas de una cancha del mismo tipo
async function agregarCanchas(canchas) {
    const connectionMongo = await connection.getConnection();
    const canchasAgregadas = await connectionMongo
        .db('canchitAppDB')
        .collection('canchas')
        .insertMany(canchas);
        await connectionMongo.close();
    return canchasAgregadas;
}

// verificarCancha revisa que el numero ingresado por cada cancha no coincida con alguna de la base, si no coincide devuelve existe en false
// si existe el numero en la base, retorna el numero existente en la base
async function verificarCancha(cancha) {
    let existe = false;
    let c = await getCancha(cancha.numero)

    if (c != null) {
        existe = true;
    }

    if (existe) {
        existe = parseInt(cancha.numero);
    }
    return existe;
}

module.exports = {
    getCanchasSegunTipo,
    getCancha,
    modificarCancha,
    deleteCancha,
    agregarCancha,
    agregarCanchas,
    getCanchas,
    verificarCancha,
};
