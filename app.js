const express = require("express");
const bodyParser = require('body-parser');
const routes = require('./server/routes.js');
const { getDataid } = require('./server/controllers.js');
const app = express();
const port = 4000;

app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
  });


//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/login',routes);
app.get('/elements',routes);
app.get('/elements/:id',async (req, res) => {
  
  const elementId = req.params.id;

  try {
    const element = await getDataid(elementId); // Récupérer un élément par ID     
      
      if (element) {
          res.json(element);
      } else {
          res.status(404).json({ message: 'Élément non trouvé' });
      }
  } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'élément', error });
  }
  res.status(200);
});


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Application exemple à l'écoute sur le port ${port}!`);
});


module.exports = app;