const mongoClient = require('mongodb').MongoClient;
const chalk = require('chalk');
const dotenv = require('dotenv').config(); 


const uriMongo = process.env.URIMONGO;




async function getConnection(){
    const client = new mongoClient(uriMongo, {useUnifiedTopology: true, useNewUrlParser: true });
    return await client.connect().catch(err => console.log(chalk.red(err)));
}



module.exports = { getConnection };