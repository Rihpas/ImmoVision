const express = require("express");
const bodyParser = require('body-parser');
const routes = require('./server/routes.js');
const app = express();
const port = 4000;

app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
  });


//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/login',routes);
//A vérifier si le doissier routes ne creer pas de conflit entre authentification et database
app.get('/database',routes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Application exemple à l'écoute sur le port ${port}!`);
});
