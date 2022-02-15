const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/dist/costalavos-frontend'))

app.get('/*' , (req ,res) => {
  res. sendFile(__dirname + '/dist/costalavos-frontend/index.html')
});

app.listen(PORT, () => {
  console.log('Servidor Iniciando na porta ' + PORT);
})
