const fs = require('fs').promises;
const { ObjectID } = require('mongodb');
const connection = require('./conexionMongo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ejwt = require('express-jwt');
const dotenv = require('dotenv').config();

// GET todos los usuarios
async function getUsuarios() {
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
async function getUsuario(email) {
    const connectionMongo = await connection.getConnection();
    const usuario = await connectionMongo
        .db('canchitAppDB')
        .collection('usuarios')
        .findOne({ email: email });

    if(usuario == null){
        throw new Error('El email no se encuentra registrado.');
    }
    return usuario;
}

// Borra un usuario en especifico
async function deleteUsuario(id) {
    const connectionMongo = await connection.getConnection();
    let mongoId = new ObjectID(id);
    const usuarioEliminado = await connectionMongo.db('canchitAppDB')
        .collection('usuarios')
        .deleteOne({ _id: mongoId });
    await connectionMongo.close();

    console.log(usuarioEliminado);
    if(usuarioEliminado.result.n === 0 ){
        throw new Error('El usuario no se pudo eliminar.');
    }

    return usuarioEliminado;
}

// Agrega un solo usuario
async function agregarUsuario(usuario) {
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
async function modificarUsuario(usuario) {
    const connectionMongo = await connection.getConnection();
    const modificaciones = {
        $set: {
            email: usuario.email,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            telefono: usuario.telefono,
            montoADevolver: usuario.montoADevolver
        }
    }
    const respuesta = await connectionMongo
        .db('canchitAppDB')
        .collection('usuarios')
        .updateOne({ email: usuario.email }, modificaciones);
    await connectionMongo.close();

    if(respuesta.result.nModified === 0){
        throw new Error('Sin cambios realizados.');
    }
    return respuesta;
}

// Modificar contraseña
async function modificarContrasena(usuario) {
    const connectionMongo = await connection.getConnection();
    usuario.nuevaPassword = await bcrypt.hash(usuario.nuevaPassword, 8);
    const user = await getUsuario(usuario.email)
    let bool = await bcrypt.compare(usuario.password, user.password)
    if (bool) {
        const modificaciones = {
            $set: {
                password: usuario.nuevaPassword
            }
        };
        const contrasenaModificada = await connectionMongo
            .db('canchitAppDB')
            .collection('usuarios')
            .updateOne({ email: usuario.email }, modificaciones);
        await connectionMongo.close();
        return contrasenaModificada;
    } else {
        await connectionMongo.close();
        throw new Error('Credenciales inválidas.');
    }


}

// Verificar usuario
async function verificarUsuario(usuario) {
    let existe = false;
    const user = await getUsuario(usuario.email)

    if (user != null) {
        throw new Error('El email ya se encuentra registrado.');
    }
    return existe;
}

async function logueo(email, password) {
    const connectionMongo = await connection.getConnection();
    const user = await connectionMongo.db('canchitAppDB')
        .collection('usuarios')
        .findOne({ email: email });
    await connectionMongo.close();
    if (!user) {
        throw new Error('Usuario o Contraseña incorrectos');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Usuario o Contraseña incorrectos');
    }

    return user;
}

async function generarToken(usuario) {
    const token = jwt.sign({ _id: usuario._id.toString() }, process.env.SECRET, { expiresIn: '1h' });
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
