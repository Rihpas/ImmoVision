const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { MongoClient } = require('mongodb');
const mongoUrl = 'mongodb://localhost:27017';
// Définition du schéma
const typeDefs = `
  type Client {
    _id : ID!
    name : String!
  }
 
  type Query {
    clients: [Client]
    
  }
 
  
`;
//client(_id: ID!): Client
async function getData() {
    
    try {
        const client = new MongoClient(mongoUrl);
        await client.connect();
     
        // Sélectionne la base de données et la collection 
        const collection = client.db('personne').collection('personnes');
     
        // Rechercher une nouvelle donnée dans la collection
        const res = await collection.find().toArray();
     
        // Fermer la connexion
        await client.close();
        console.log(res);
        return res;
      
    } catch (error) {
      console.error(error.message);
    }
  }
  
  async function ajoutData( id, nom, mail , motdepasse ) {
    
    try {
        const client = new MongoClient(mongoUrl);
        await client.connect();
     
        // Sélectionne la base de données et la collection 
        const collection = client.db('personne').collection('personnes');
     
        // Rechercher une nouvelle donnée dans la collection
        await collection.insertOne({ _id: id ,name:nom ,email: mail , mdp : motdepasse});
     
        // Fermer la connexion
        await client.close();
        
      
    } catch (error) {
      console.error(error.message);
    }
  }
  async function modData( id, nom, mail , motdepasse ) {
    
    try {
        const client = new MongoClient(mongoUrl);
        await client.connect();
     
        // Sélectionne la base de données et la collection 
        const collection = client.db('personne').collection('personnes');
     
        // Rechercher une nouvelle donnée dans la collection
        await collection.updateOne({ _id: id},{name:nom ,email: mail , mdp : motdepasse});
     
        // Fermer la connexion
        await client.close();
        
      
    } catch (error) {
      console.error(error.message);
    }
  }
  async function supprData( id ) {
    
    try {
        const client = new MongoClient(mongoUrl);
        await client.connect();
     
        // Sélectionne la base de données et la collection 
        const collection = client.db('personne').collection('personnes');
     
        // Rechercher une nouvelle donnée dans la collection
        await collection.deleteOne({ _id: id });
     
        // Fermer la connexion
        await client.close();
        
      
    } catch (error) {
      console.error(error.message);
    }
  }
  async function getDataid(id) {
    
    try {
        const client = new MongoClient(mongoUrl);
        await client.connect();
     
        // Sélectionne la base de données et la collection 
        const collection = client.db('personne').collection('personnes');
     
        // Rechercher une nouvelle donnée dans la collection
        const res = await collection.find({_id:id},{name:true}).toArray();
     
        // Fermer la connexion
        await client.close();
        console.log(res);
        return res;
      
    } catch (error) {
      console.error(error.message);
    }
  }
// Données simulées

// Resolvers : Fournissent la logique pour les requêtes et mutations
const resolvers = {
  Query: {
    clients: () => getData(),
    //client: ({id}) => getDataid(id),
  },
  
  };

 
// Création du serveur Apollo
const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
    listen: { port: 4000 },
  }).then(({ url }) => {
    console.log(`🚀 Serveur prêt à l'adresse : ${url}`);
  });
 
 
 
  function sendData() {
    const dataInput = document.getElementById('dataInput');
    const outputDiv = document.getElementById('output');
   
    const data = dataInput.value;
   
    // Utilisez fetch pour envoyer des données au serveur
    fetch('/sendData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    })
    .then(response => response.json())
    .then(result => {
      outputDiv.innerText = `Server Response: ${result.message}`;
    })
    .catch(error => {
      console.error('Error sending data:', error);
    });
  }

ajoutData(2,"testnom","teste",'testmdp')
ajoutData(3,"testnom","teste",'testmdp')
ajoutData(4,"testnom","teste",'testmdp')
ajoutData(5,"testnom","teste",'testmdp')

modData(1,"testnom","teste@mail",'testmdp')
console.log(getDataid(1));
