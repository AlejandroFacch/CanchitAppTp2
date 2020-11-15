const moment = require('moment');

// Para que la fecha se imprima en español
moment.locale('es');


// moment().format('LTS') => hh:mm:ss
//moment().format('LT') =>  hh:mm

// format 'l' => dd/mm/aaaa
const formatoConNumero = 'l';
const hoy = moment().format(formatoConNumero);
console.log(`Dia con formato dd/mm/aaaa : ${hoy}`);

// moment().format('LLLL'); // jueves, 29 de octubre de 2020 17:54
 const formatoCompleto = 'LLLL'
 const fechaCompleta = moment().format(formatoCompleto);


console.log(`Fecha completa con texto: ${fechaCompleta}`);


const Hoy = moment();
// add maneja dos parametros, (Cantidad a restar, Que se desea sumar/restar (dia,mes,año, hora, etc))
const ayer = moment().add( -1,'days');
 console.log(ayer);

// Tambien se puede trabajar
// sin necesidad de crear otra instancia
// usando un clon : 
const Ayer = Hoy.clone().add(-1, 'days');
const manana = Hoy.clone().add( 1, 'days').format(formatoConNumero);

console.log(manana);


// Imprimiendo en forma de tabla
const formato = 'dddd Do MMMM YYYY';
console.table({
    Hoy : Hoy.format( formato ),
    ayer : ayer.format( formato ),
    manana : Hoy.clone().add(1,'days').format(formato),
});


// Tambien se puede pasar una fecha exacta 
const fechaExacta = moment('2020-10-16');
console.log(fechaExacta.format(formato));

// fechaExacta con arreglo : [año, mes del 0 al 11, dia, hora, minutos]
const fechaExacta2 = moment([1992, 9 , 16 , 23, 15]);
console.log(fechaExacta2.format(formatoCompleto));

// Si deseo saber cantidad de dias del mes
const mes = 1;
const cantDias = moment([2020, mes]).daysInMonth();
console.log(`el mes ${mes} en el año ${moment().year()} tuvo ${cantDias} dias`);