const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");
const connectToDB = require("./db/database");

const saltRounds = 10;

//~~~~~~~~~~~~~~~~~~~~~~~ Authentification ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function showLogin(req, res) {
  res.status(200).render("../public/connectionuser.html", { error: null });
}

async function registerloging(req, res) {
  const { username, emailuser, password } = req.body;

  try {
    const { bdd, client } = await connectToDB();
    const collection = client.db('personne').collection("personnes");

    const utilisateur = await collection.findOne({ name: username });
    if (utilisateur) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await collection.insertOne({
      name: username,
      email: emailuser,
      mdp: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });

    await client.close();
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
}

async function verifLogin(req, res) {
  const { username, password } = req.body;

  try {
    const { bdd, client } = await connectToDB();
    const collection = client.db('personne').collection("personnes");

    const utilisateur = await collection.findOne({ name: username });
    if (!utilisateur) {
      res.status(401).json({ message: "Erreur authentifictation" });
    }

    const motDePasseValide = await bcrypt.compare(password, utilisateur.mdp);
    if (!motDePasseValide) {
      
      res.status(401).json({ message: "Erreur authentifictation" });
    }

    res.render("../public/frontpage.html", { username });
    await client.close();
  } catch (error) {
    console.error("Erreur lors de la vérification :", error.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~ Gestion BDD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function getData() {
  try {
    const { bdd, client } = await connectToDB();
    const collection = client.db('personne').collection("personnes");
    const res = await collection.find().toArray();
    await client.close();
    return res;
  } catch (error) {
    console.error(error.message);
  }
}

async function ajoutData(nom, mail, motdepasse) {
  try {
    const { bdd, client } = await connectToDB();
    const collection = client.db('personne').collection("personnes");

    await collection.insertOne({
      name: nom,
      email: mail,
      mdp: motdepasse,
    });

    await client.close();
  } catch (error) {
    console.error(error.message);
  }
}

async function modData(id, nom, mail, motdepasse) {
  try {
    const { bdd, client } = await connectToDB();
    const collection = client.db('personne').collection("personnes");

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name: nom, email: mail, mdp: motdepasse } }
    );

    await client.close();
  } catch (error) {
    console.error(error.message);
  }
}

async function supprData(id) {
  try {
    const { bdd, client } = await connectToDB();
    const collection = client.db('personne').collection("personnes");

    // Assure-toi que l'ID est converti en ObjectId
    await collection.deleteOne({ _id: new ObjectId(id) });

    await client.close();
  } catch (error) {
    console.error(error.message);
  }
}


async function getDataid(id) {
  try {
    const { bdd, client } = await connectToDB();
    const collection = client.db('personne').collection("personnes");

    const res = await collection.find({ _id: new ObjectId(id) }).toArray();
    await client.close();
    return res;
  } catch (error) {
    console.log("oh j'ai mal");
    console.error(error.message);
  }
}

module.exports = {
  showLogin,
  registerloging,
  verifLogin,
  getData,
  ajoutData,
  modData,
  supprData,
  getDataid,
};

