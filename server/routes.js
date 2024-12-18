const express = require('express');
const router = express.Router();

//~~~~~~~~~~~~~~~~~~~~~~~Ãuthentification~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Importer le contrôleur d'authentification
const { showLogin, verifLogin } = require('../server/controllers.js');

router.get('/login', showLogin);

router.post('/login', verifLogin);

//~~~~~~~~~~~~~~~~~~~~~~~Gestion BDD~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const {
    getData,
    ajoutData,
    modData,
    supprData,
    getDataid,
} = require('./controllers');


const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

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



module.exports = router;