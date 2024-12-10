const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
 
const app = express();
 
// configuration du hash
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
 
// uniquement pour l'exercice on hash manuellement le mdp à ne pas reproduire !!!
const hashedPassword = bcrypt.hashSync("password123", salt);
 
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
 
// Simuler une base de données
const users = [
 { username: 'testuser', password: hashedPassword } // Password: "password123"
];
 
// Page de connexion
app.get('/', (req, res) => {
 res.render('login', { error: null });
});
 
// Vérification des identifiants
app.post('/login', async (req, res) => {
 const { username, password } = req.body;
 const user = users.find(u => u.username === username);
 if (!user) {
     return res.render('login', { error: 'Nom d’utilisateur incorrect.' });
 }
 
 const match = await bcrypt.compare(password, user.password);
 if (!match) {
     return res.render('login', { error: 'Mot de passe incorrect.' });
 }
 
 // Authentification réussie
 res.render('dashboard', { username });
});
 
// Lancer le serveur
const PORT = 4000;
app.listen(PORT, () => {
 console.log(`Serveur en cours d’exécution sur http://localhost:${PORT}`);
});