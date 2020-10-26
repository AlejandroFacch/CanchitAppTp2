const fs = require('fs').promises;
const { ObjectID } = require('mongodb');
const connection = require('./conexionMongo');  


// GET todos los usuarios
async function getUsuarios(){
    const connectionMongo = await connection.getConnection();
    const usuarios = await connectionMongo
                         .db('canchitAppDB')
                         .collection('usuario')
                         .find()
                         .toArray();
     return usuarios;
 }




 // GET de un usuario en especifico
 async function getUsuario(email){
    const connectionMongo = await connection.getConnection();
    const usuario= await connectionMongo
                         .db('canchitAppDB')
                         .collection('usuario')
                         .findOne({email: email});
    return usuario;
}

// Borra un usuario en especifico
async function deleteUsuario(id){
    const connectionMongo = await connection.getConnection();
    let mongoId = new ObjectID(id);
    const usuarioEliminado = await connectionMongo.db('canchitAppDB')
                            .collection('usuario')
                            .deleteOne({_id: mongoId});
    return usuarioEliminado;
}

// Agrega un solo usuario
async function agregarUsuario (usuario){
    const connectionMongo = await connection.getConnection();
    const usuarioAgregado = await connectionMongo
                         .db('canchitAppDB')
                         .collection('usuario')
                         .insertOne(usuario);
    return usuarioAgregado;
}

// Modificar un solo usuario
async function modificarUsuario (usuario){
    const connectionMongo = await connection.getConnection();
    const usuarioModificado = await connectionMongo
                         .db('canchitAppDB')
                         .collection('usuario')
                         .updateOne(usuario);
    return usuarioModificado;
}

// Verificar usuario
async function verificarUsuario (usuario) {
    let existe = false;
    let user = await getUsuario(usuario.email)

    if(user != null){
        existe = true;
    }
        return existe;
}

module.exports = {getUsuarios, getUsuario, deleteUsuario, agregarUsuario, modificarUsuario, verificarUsuario}