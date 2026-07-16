// backend/src/server.js
const express = require('express');
const cors = require('cors');
const routes = require('./routes'); // <-- Importa o routes.js da mesma pasta src/
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Garante que o express use as rotas com o prefixo /api
app.use('/api', routes); // <-- O prefixo /api deve estar aqui

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});