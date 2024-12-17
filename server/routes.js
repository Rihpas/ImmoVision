const express = require('express');
const router = express.Router();

// Importer le contrôleur d'authentification
const { showLogin, verifLogin } = require('../server/controllers.js');

router.get('/login', showLogin);

router.post('/login', verifLogin);


module.exports = router;