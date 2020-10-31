const fs = require('fs').promises;
const { ObjectID } = require('mongodb');
const connection = require('./conexionMongo');  
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ejwt = require('express-jwt');

// GET todos los usuarios
async function getUsuarios(){
    const connectionMongo = await connection.getConnection();
    const usuarios = await connectionMongo
                         .db('canchitAppDB')
                         .collection('usuarios')
                         .find()
                         .toArray();
     return usuarios;
 }

 // GET de un usuario en especifico
 async function getUsuario(email){
    const connectionMongo = await connection.getConnection();
    const usuario= await connectionMongo
                         .db('canchitAppDB')
                         .collection('usuarios')
                         .findOne({email: email});
    return usuario;
}

// Borra un usuario en especifico
async function deleteUsuario(id){
    const connectionMongo = await connection.getConnection();
    let mongoId = new ObjectID(id);
    const usuarioEliminado = await connectionMongo.db('canchitAppDB')
                            .collection('usuarios')
                            .deleteOne({_id: mongoId});
    return usuarioEliminado;
}

// Agrega un solo usuario
async function agregarUsuario (usuario){
    const connectionMongo = await connection.getConnection();
    usuario.password = await bcrypt.hash(usuario.password, 8);
    const usuarioAgregado = await connectionMongo
                         .db('canchitAppDB')
                         .collection('usuarios')
                         .insertOne(usuario);
    return usuarioAgregado;
}

// Modificar un solo usuario
async function modificarUsuario (usuario){
    const connectionMongo = await connection.getConnection();
    const usuarioModificado = await connectionMongo
                         .db('canchitAppDB')
                         .collection('usuarios')
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

async function logueo(email, password) {
    const connectionMongo = await connection.getConnection();
    const user = await connectionMongo.db('canchitAppDB')
                        .collection('usuarios')
                        .findOne({email: email});
    if(!user){
        throw new Error('Usuario o Contraseña incorrectos');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Usuario o Contraseña incorrectos');
    }

    return user;
}

async function generarToken(usuario){
    const secreto = 'canchitapp';
    const token = jwt.sign({_id: usuario._id.toString()}, secreto, {expiresIn: '1h'});
    return token;
}

module.exports = {
  getUsuarios,
  getUsuario,
  deleteUsuario,
  agregarUsuario,
  modificarUsuario,
  verificarUsuario,
  logueo,
  generarToken,
};
