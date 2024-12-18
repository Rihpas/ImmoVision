const bcrypt = require('bcryptjs');
const connectToDB = require('./db/database');

//~~~~~~~~~~~~~~~~~~~~~~~Ãuthentification~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
 
// uniquement pour l'exercice on hash manuellement le mdp à ne pas reproduire !!!
const hashedPassword = bcrypt.hashSync("password123", salt);


const users = [
    { username: 'testuser', password: hashedPassword } // Password: "password123"
];

function showLogin(req, res) {
    res.render('../public/connexionuser.ejs', { error: null });
}

async function verifLogin(req,res){
    const { username, password } = req.body;
     const user = users.find(u => u.username === username);
     if (!user) {
         return res.render('../public/connexionuser.ejs', { error: 'Nom d’utilisateur incorrect.' });
     }
     
     const match = await bcrypt.compare(password, user.password);
     if (!match) {
         return res.render('../public/connexionuser.ejs', { error: 'Mot de passe incorrect.' });
     }
     
     // Authentification réussie
     res.render('../public/frontpage.html', { username });
}

//~~~~~~~~~~~~~~~~~~~~~~~Gestion BDD~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//client(_id: ID!): Client
async function getData() {
    
    try {
        const { bdd, client } = await connectToDB();
        // Sélectionne la base de données et la collection 
        const collection = bdd.collection('personnes');
     
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
        const { bdd, client } = await connectToDB();
        // Sélectionne la base de données et la collection 
        const collection = bdd.collection('personnes')
     
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
        const { bdd, client } = await connectToDB();
        // Sélectionne la base de données et la collection 
        const collection = bdd.collection('personnes')
     
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
        const { bdd, client } = await connectToDB();
        // Sélectionne la base de données et la collection 
        const collection = bdd.collection('personnes')
     
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
        const { bdd, client } = await connectToDB();
        // Sélectionne la base de données et la collection 
        const collection = bdd.collection('personnes')
     
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






module.exports = { showLogin, 
    verifLogin,
    getData,
    ajoutData,
    modData,
    supprData,
    getDataid,
 };
