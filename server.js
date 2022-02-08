const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/dist/_costalavos-frontend'))

app.get('/*' , (req ,res) => {
  res. sendFile(__dirname + '/dist/_costalavos-frontend/index.html')
});

app.listen(PORT, () => {
  console.log('Servidor Iniciando na porta ' + PORT);
})
