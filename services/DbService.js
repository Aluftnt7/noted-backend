const MongoClient = require('mongodb').MongoClient;

const config = require('../config')


module.exports = {
    getCollection
}

// Database Name
const dbName = 'noted';

var dbConn = null;

async function getCollection(collectionName) {
    const db = await connect()
    console.log('test psik',collectionName);
    return db.collection(collectionName);
}

async function connect() {
    if (dbConn) return dbConn;
    try {
        
        const client = await MongoClient.connect(config.dbURL, { useUnifiedTopology: true });
        console.log('here, inside conect inside Dbservice, inside something');
        const db = client.db(dbName);
        dbConn = db;
        return db;
    } catch (err) {
        console.log('Cannot Connect to DB', err)
        throw err;
    }
}