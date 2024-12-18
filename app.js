const express = require("express");
const bodyParser = require('body-parser');
const routes = require('./server/routes.js');
const app = express();
const port = 4000;

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/login',routes);
//A vérifier si le doissier routes ne creer pas de conflit entre authentification et database
app.get('/database',routes);

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.listen(port, () => {
  console.log(`Application exemple à l'écoute sur le port ${port}!`);
});
