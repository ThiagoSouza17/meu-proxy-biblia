// api/index.js

const express = require('express');
const fetch = require('node-fetch'); 
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/biblia', async (req, res) => {
    const { livro, capitulo } = req.query; 
    const VERSAO = 'nvi';

    if (!livro || !capitulo) {
        return res.status(400).json({ 
            error: 'Parâmetros "livro" e "capitulo" são obrigatórios.',
            exemplo: '/api/biblia?livro=gn&capitulo=1'
        });
    }

    const externalApiUrl = `https://www.abibliadigital.com.br/api/verses/${VERSAO}/${livro}/${capitulo}`;

    try {
        const response = await fetch(externalApiUrl);

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

app.get('/api', (req, res) => {
    res.json({ status: 'Proxy da Bíblia ativo', use_path: '/api/biblia?livro=gn&capitulo=1' });
});

module.exports = app;
const server = app;

module.exports = (req, res) => {
  return server(req, res);
};
