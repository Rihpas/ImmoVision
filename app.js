const express = require("express");
const bodyParser = require('body-parser');
const authRoutes = require('./server/routes.js');
const app = express();
const port = 4000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/login',authRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.listen(port, () => {
  console.log(`Application exemple à l'écoute sur le port ${port}!`);
});
