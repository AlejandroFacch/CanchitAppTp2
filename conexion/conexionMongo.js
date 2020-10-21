const mongoClient = require('mongodb').MongoClient;
const chalk = require('chalk');

const uriMongo = 'mongodb+srv://admin:admin@cluster0.uyw4y.mongodb.net/canchitAppDB?retryWrites=true&w=majority';

const client = new mongoClient(uriMongo, {useUnifiedTopology: true, useNewUrlParser: true });

async function getConnection(){
    return await client.connect().catch(err => console.log(chalk.red(err)));
}

module.exports = {getConnection};