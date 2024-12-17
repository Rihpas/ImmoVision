const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.post("/", (req, res) => {
  res.status(200).send("requête réussi");

  if 
});

app.listen(port, () => {
  console.log(`Application exemple à l'écoute sur le port ${port}!`);
});
