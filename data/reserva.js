const fs = require('fs').promises;
const { ObjectID } = require('mongodb');
const connection = require('./conexionMongo');
const moment = require('moment-timezone');

// GET todos las reservas
async function getReservas() {
    const connectionMongo = await connection.getConnection();
    const reservas = await connectionMongo
        .db('canchitAppDB')
        .collection('reservas')
        .find()
        .toArray();
    await connectionMongo.close();
    return reservas;
}
//Se utilizará para hacer una verificación cuando se reserve para evitar duplicaciones
//Entre el momento en que pide los turnos disponibles y el momento en que reserva, 
//otro usuario puede hacer la misma reserva.
async function chequeoReserva(reserve) {
    const connectionMongo = await connection.getConnection();
    reserve.dia = new Date(reserve.dia);
    const reserva = await connectionMongo
        .db('canchitAppDB')
        .collection('reservas')
        .findOne({ nroCancha: reserve.nroCancha, hora: reserve.hora, dia: reserve.dia })
    await connectionMongo.close();
    return reserva;
}

// Get Lista de Reservas, pero desde hoy en adelante, sin mostras las suspendidas
async function getReservasPorFecha() {
    const connectionMongo = await connection.getConnection();
    const hoy = moment(new Date(moment().year(), moment().month(), moment().date(), 0, 0)).toDate();
    const reservas = await connectionMongo
        .db('canchitAppDB')
        .collection('reservas')
        .find({ dia: { $gte: hoy }, suspendida: false })
        .toArray();
    await connectionMongo.close();
    return reservas;
}

//devuelve una lista de reservas de una cancha en particular,
//esto se utilizara para filtrar los dias y horas que no estara disponible la cancha
async function buscarReservasPorNroCanchaYFecha(numero) {
    const connectionMongo = await connection.getConnection();
    const hoy = moment(new Date(moment().year(), moment().month(), moment().date(), 0, 0)).toDate();
    console.log(hoy);
    const reservas = await connectionMongo
        .db('canchitAppDB')
        .collection('reservas')
        .find({ nroCancha: numero, dia: { $gte: hoy } })
        .toArray();
    await connectionMongo.close();
    return reservas;
}

// GET de una reserva en especifica
async function getReserva(id) {
    const connectionMongo = await connection.getConnection();
    let mongoId = new ObjectID(id);
    const reserva = await connectionMongo
        .db('canchitAppDB')
        .collection('reservas')
        .findOne({ _id: mongoId });
    await connectionMongo.close();
    if (reserva == null) {
        throw new Error('No existe la reserva solicitada.');
    }
    return reserva;
}

// Borra una reserva en especifica
async function deleteReserva(id) {
    const connectionMongo = await connection.getConnection();
    let mongoId = new ObjectID(id);
    const reservaEliminada = await connectionMongo.db('canchitAppDB')
        .collection('reservas')
        .deleteOne({ _id: mongoId });
    await connectionMongo.close();
    console.log(reservaEliminada);
    if (reservaEliminada.result.n === 0) {
        throw new Error('La reserva no se pudo eliminar.');
    }
    return reservaEliminada;
}

// Agrega una sola reserva
async function agregarReserva(reserva) {
    const connectionMongo = await connection.getConnection();
    reserva.dia = new Date(reserva.dia);
    const reservaAgregada = await connectionMongo
        .db('canchitAppDB')
        .collection('reservas')
        .insertOne(reserva);
    await connectionMongo.close();
    return reservaAgregada;
}

// Modificar una sola reserva
async function modificarReserva(reserva) {
    const connectionMongo = await connection.getConnection();
    const reservaModificada = await connectionMongo
        .db('canchitAppDB')
        .collection('reservas')
        .updateOne(reserva);
    await connectionMongo.close();
    return reservaModificada;
}

// Suspender una sola reserva
async function suspenderReserva(reserva) {
    const connectionMongo = await connection.getConnection();
    console.log("reserva", reserva);
    let mongoId = new ObjectID(reserva.id);
    const modificacion = {
        $set: {
            suspendida: true,
        },
    };

    const reservaModificada = await connectionMongo
        .db('canchitAppDB')
        .collection('reservas')
        .updateOne({ _id: mongoId }, modificacion);
    await connectionMongo.close();
    return reservaModificada;
}

function generacionListadoDisponibles(hoy, horaPrimerTurno, horaUltimoTurno, listaReservas, horarios, diasNoAtencion, reservasOcupadas) {
    //En este if se fija si en la hora que me encuentro supera el ultimo horario de las canchas
    //De superarlo le agrega un dia para mostrar horarios de dias posteriores al actual
    if (hoy.hour() >= horaUltimoTurno) {
        hoy = moment([hoy.year(), hoy.month(), hoy.date() + 1, horaPrimerTurno, 0]);
    }

    //Este for se utilizara para crear una lista de dias con el largo que se coloque en el parametro del medio
    for (let d = 0; d <= 15; d++) {
        //Este if se fija si en el dia actual estoy dentro del rango horario de atencion de las canchas
        //De encontrarme dentro del rango coloca como hora del primer turno la hora siguiente a la que estoy actualmente
        if (d == 0 && (moment().date() == hoy.date()) && (hoy.hour() >= horaPrimerTurno && hoy.hour() < horaUltimoTurno)) {
            horaPrimerTurno = hoy.hour() + 1;
            //se le agrega al dia de hoy la hora del primer turno nueva
            hoy = moment([hoy.year(), hoy.month(), hoy.date(), horaPrimerTurno, 0]);
        } else {
            horaPrimerTurno = parseInt(horarios.horarioDeInicio);
        }
        //se crea un objeto con la fecha
        let dia = hoy.date() + d;
        let date = new Date(hoy.year(), hoy.month(), dia, 0, 0);
        let fecha = moment(date);
        let diaYHora = {
            dia: fecha,
            horarios: []
        }
        let listaHoras = [];
        //este for va creando una lista de horarios, los cuales se utilizaran para que la persona reserve
        for (let h = horaPrimerTurno; h <= horaUltimoTurno; h++) {
            listaHoras.push(h);
        }
        //se agrega al obejto creado anteriormente la lista de horarios y se agrega en la lista de turnos disponibles
        diaYHora.horarios = listaHoras;
        listaReservas.push(diaYHora);
    }

    listaReservas = verificarDiasDisponibles(diasNoAtencion, listaReservas);
    listaReservas = verificarListadoReservas(reservasOcupadas, listaReservas);

    return listaReservas;
}



function verificarListadoReservas(reservasOcupadas, listaReservas) {
    //Este if pregunta si la lista de turnos ocupados tiene algun dato
    console.log(reservasOcupadas);
    if (reservasOcupadas.length > 0) {
        //Estos for comparan la lista de turnos ocupados, con la de turnos libres creadas anteriormente
        for (let f = 0; f < reservasOcupadas.length; f++) {
            let turnoUtilizado = moment(reservasOcupadas[f].dia);
            console.log(turnoUtilizado);
            for (let i = 0; i < listaReservas.length; i++) {
                //De existir fechas que coincidan se pasara a verificar los horarios
                if (turnoUtilizado.year() == listaReservas[i].dia.year() && turnoUtilizado.month() == listaReservas[i].dia.month() && turnoUtilizado.date() == listaReservas[i].dia.date()) {
                    let index = 0;
                    let encontrado = false;
                    while (encontrado == false && index < listaReservas[i].horarios.length) {
                        const element = listaReservas[i].horarios[index];

                        //verifica los horarios, si alguno coincide lo borra de la lista de horarios del objeto
                        if (reservasOcupadas[f].hora == element) {
                            listaReservas[i].horarios.splice(index, 1);
                            encontrado = true;
                        }
                        index++;
                    }
                }
            }
        }
    }

    return listaReservas;
}



function verificarDiasDisponibles(diasNoAtencion, listaReservas) {
    if (diasNoAtencion.dias.dias.length > 0) {
        let dia = '';
        for (let d = 0; d < diasNoAtencion.dias.dias.length; d++) {
            dia = diasNoAtencion.dias.dias[d];
            switch (dia) {
                case 'Lunes':
                    dia = 'Monday';
                    break;
                case 'Martes':
                    dia = 'Tuesday';
                    break;
                case 'Miércoles':
                    dia = 'Wednesday';
                    break;
                case 'Jueves':
                    dia = 'Thursday';
                    break;
                case 'Viernes':
                    dia = 'Friday';
                    break;
                case 'Sábado':
                    dia = 'Saturday';
                    break;
                case 'Domingo':
                    dia = 'Sunday';
                    break;
            }

            for (let i = 0; i < listaReservas.length; i++) {
                let diaReserva = moment(listaReservas[i].dia).format('dddd')
                if (dia == diaReserva) {
                    listaReservas.splice(i, 1);
                }
            }
        }
    }

    return listaReservas;
}

async function getMiReserva(email) {
    const connectionMongo = await connection.getConnection();
    const hoy = moment(new Date(moment().year(), moment().month(), moment().date(), 0, 0)).toDate();
    const reserva = await connectionMongo
        .db('canchitAppDB')
        .collection('reservas')
        .findOne({ email: email, dia: { $gte: hoy }, suspendida: false });
    await connectionMongo.close();
    if (!reserva) {
        return false;
    } else {
        return reserva
    }
}


module.exports = {
    getReservas,
    getReserva,
    chequeoReserva,
    getReservasPorFecha,
    deleteReserva,
    agregarReserva,
    modificarReserva,
    suspenderReserva,
    buscarReservasPorNroCanchaYFecha,
    generacionListadoDisponibles,
    getMiReserva
};
