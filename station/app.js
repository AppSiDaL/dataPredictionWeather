const express = require('express');
const app = express();

app.get('/SignIn', (req, res) => {
  const nombre = req.query.nombre;
  const carrera = req.query.carrera;

  res.send(`Nombre: ${nombre}<br>
            Carrera: ${carrera}`);
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
