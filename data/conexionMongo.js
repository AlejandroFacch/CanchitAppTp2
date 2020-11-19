const mongoClient = require('mongodb').MongoClient;
const chalk = require('chalk');
const dotenv = require('dotenv').config(); 

// const uriMongo = 'mongodb+srv://admin:admin@cluster0.uyw4y.mongodb.net/canchitAppDB?retryWrites=true&w=majority';
const uriMongo = process.env.URIMONGO;
console.log(uriMongo);



async function getConnection(){
    const client = new mongoClient(uriMongo, {useUnifiedTopology: true, useNewUrlParser: true });
    return await client.connect().catch(err => console.log(chalk.red(err)));
}



module.exports = { getConnection };