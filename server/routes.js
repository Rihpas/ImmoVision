const express = require('express');
const router = express.Router();

//~~~~~~~~~~~~~~~~~~~~~~~Ãuthentification~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Importer le contrôleur d'authentification
const { showLogin, verifLogin,registerloging } = require('../server/controllers.js');

router.get('/login', showLogin);
router.post('/inscription', registerloging);
router.post('/login', verifLogin);
router.get('/elements', async (req, res) => {
  try {
      const elements = await getData(); // Récupérer tous les éléments depuis la BDD
      res.json(elements);
  } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des éléments', error });
  }
});



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
  _id: ID!
  name: String!
  email: String!
}

# Définition des requêtes
type Query {
  clients: [Client!]       # Récupérer tous les clients
  client(id: ID!): Client  # Récupérer un client par ID
}

# Définition des mutations
type Mutation {
  addClient(name: String!, email: String!, password: String!): Client!    # Ajouter un client
  updateClient(id: ID!, name: String!, email: String!, password: String!): Client! # Modifier un client
  deleteClient(id: ID!): Boolean!   # Supprimer un client
}
 
  
`;

// Resolvers : Fournissent la logique pour les requêtes et mutations
const resolvers = {
  Query: {
    // Résolver pour récupérer tous les clients
    clients: async () => {
      return await getData();
    },
    
    // Résolver pour récupérer un client par ID
    client: async (_, { id }) => {
      const clientData = await getDataid(id);
      return clientData[0]; // retourne le premier élément trouvé
    },
  },

  Mutation: {
    // Résolver pour ajouter un nouveau client
    addClient: async (_, { name, email, password }) => {
      // Hachage du mot de passe avant l'ajout
      const hashedPassword = await bcrypt.hash(password, 10);

      // Appel à la fonction d'ajout dans la BDD
      await ajoutData(name, email, hashedPassword);

      return {
        _id: "mocked-id", // Remplace par l'ID généré par MongoDB dans la fonction `ajoutData` si nécessaire
        name,
        email,
      };
    },

    // Résolver pour mettre à jour un client
    updateClient: async (_, { id, name, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      await modData(id, name, email, hashedPassword);

      return {
        _id: id,
        name,
        email,
      };
    },

    // Résolver pour supprimer un client
    deleteClient: async (_, { id }) => {
      await supprData(id);
      return true; // Retourne true si la suppression est réussie
    },
  },
};

// Création du serveur Apollo
const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
    listen: { port: 4001 },
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

ajoutData("testnom","teste",'testmdp')
ajoutData("testnom","teste",'testmdp')
ajoutData("testnom","teste",'testmdp')
ajoutData("testnom","teste",'testmdp')

modData(1,"testnom","teste@mail",'testmdp')
console.log(getDataid(1));



module.exports = router;