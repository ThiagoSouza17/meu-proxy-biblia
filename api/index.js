// api/index.js

// Importações
require('dotenv').config(); // Carrega variáveis do .env
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite acesso CORS

// Rota principal da API - acessível via /api/biblia
app.get('/api/biblia', async (req, res) => {
  const { livro, capitulo } = req.query;
  const VERSAO = 'nvi';

  if (!livro || !capitulo) {
    return res.status(400).json({
      error: 'Parâmetros "livro" e "capitulo" são obrigatórios.',
      exemplo: '/api/biblia?livro=gn&capitulo=1'
    });
  }

  // Monta a URL da API externa
  const externalApiUrl = `https://www.abibliadigital.com.br/api/verses/${VERSAO}/${livro}/${capitulo}`;

  try {
    const response = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.BIBLIA_TOKEN}`
      }
    });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {}
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erro no proxy:', error);
    res.status(500).json({ error: 'Erro interno ao buscar dados da Bíblia Digital.' });
  }
});

// Rota raiz de verificação
app.get('/api', (req, res) => {
  res.json({
    status: 'Proxy da Bíblia ativo',
    use_path: '/api/biblia?livro=gn&capitulo=1'
  });
});

// Inicia o servidor na porta definida pelo Railway ou localmente
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
