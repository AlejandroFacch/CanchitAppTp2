const fs = require('fs').promises;
const { ObjectID} = require('mongodb');
const connection = require('./conexionMongo');  
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ejwt = require('express-jwt');
const dotenv = require('dotenv').config();

// GET todos los usuarios
async function getUsuarios(){
    const connectionMongo = await connection.getConnection();
    const usuarios = await connectionMongo
                         .db('canchitAppDB')
                         .collection('usuarios')
                         .find()
                         .toArray();
                         await connectionMongo.close();
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
                            await connectionMongo.close();
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
                         await connectionMongo.close();
    return usuarioAgregado;
}

// Modificar un solo usuario
async function modificarUsuario (usuario){
    const connectionMongo = await connection.getConnection();
    let mongoId = new ObjectID(usuario._id);
    const modificaciones = {
        $set: {
            email: usuario.email,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            telefono: usuario.telefono,
        }
    }
    const usuarioModificado = await connectionMongo
                         .db('canchitAppDB')
                         .collection('usuarios')
                         .updateOne({ _id: mongoId }, modificaciones);
                         await connectionMongo.close();
    return usuarioModificado;
}

// Modificar contraseña
async function modificarContrasena (usuario){
    const connectionMongo = await connection.getConnection();
    //usuario.password=await bcrypt.hash(usuario.password,8);
    //usuario.newPassword= await bcrypt.hash(usuario.newPassword,8);
    usuario.nuevaPassword= await bcrypt.hash(usuario.nuevaPassword,8);
    const user = await getUsuario(usuario.email)
    //let mongoId = new ObjectID(usuario._id);

    console.log("Password :",user.password," Password  2:",usuario.password)
    console.log("new Password:",usuario.newPassword)
    console.log("Confirm Password:",usuario.nuevaContrasenia)

    let bool = await bcrypt.compare(usuario.password, user.password)
    console.log(bool)
    if(bool) {
        const modificaciones= {
            $set: {
                password: usuario.nuevaPassword
            }};
            const contrasenaModificada = await connectionMongo
                         .db('canchitAppDB')
                         .collection('usuarios')
                         .updateOne({ email: usuario.email }, modificaciones);
                         await connectionMongo.close();
    }else {
        await connectionMongo.close();
        return false;
    }
    
    return  contrasenaModificada;
}

// Verificar usuario
async function verificarUsuario (usuario) {
    let existe = false;
    const user = await getUsuario(usuario.email)

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
                        await connectionMongo.close();
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
    const token = jwt.sign({_id: usuario._id.toString()}, process.env.SECRET, {expiresIn: '1h'});
    return token;
}

module.exports = {
  getUsuarios,
  getUsuario,
  deleteUsuario,
  agregarUsuario,
  modificarUsuario,
  modificarContrasena,
  verificarUsuario,
  logueo,
  generarToken,
};
