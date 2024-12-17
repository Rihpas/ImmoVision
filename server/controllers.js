const bcrypt = require('bcryptjs');

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


module.exports = { showLogin, verifLogin };
