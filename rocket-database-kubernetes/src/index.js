const express = require('express');
const { pool, initDb, checkConnection } = require('./db');

const app = express();
app.use(express.json());

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

app.get('/readyz', async (req, res) => {
  try {
    await checkConnection();
    res.status(200).json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not-ready', error: error.message });
  }
});

app.get('/status', async (req, res) => {
  try {
    await checkConnection();
    res.status(200).json({ message: 'Conexao OK' });
  } catch (error) {
    res.status(500).json({ message: 'Falha na conexao', error: error.message });
  }
});

app.post('/dados', async (req, res) => {
  const { valor } = req.body;

  if (!valor) {
    return res.status(400).json({ error: 'Campo valor e obrigatorio' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO dados (valor) VALUES ($1) RETURNING id, valor, criado_em',
      [valor]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao inserir dado', details: error.message });
  }
});

app.get('/dados', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, valor, criado_em FROM dados ORDER BY id DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar dados', details: error.message });
  }
});

const PORT = Number(process.env.PORT || 3000);

async function start() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`API iniciada na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar API:', error.message);
    process.exit(1);
  }
}

start();
