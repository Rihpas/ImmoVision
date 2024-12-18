const { MongoClient } = require('mongodb');
const mongoUrl = 'mongodb://localhost:27017';

async function connectToDB() {
    const client = new MongoClient(mongoUrl);
    await client.connect();
    console.log('Connexion à la base de données réussie');
    const db = client.db('personne');
    return { db, client }; // Retourne `db` et `client`
}

module.exports = connectToDB, MongoClient;

