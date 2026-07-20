const express = require('express');
const pool = require('./db');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Docker funcionando!');
});

router.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.send('Database connected');
  } catch (error) {
    res.status(500).send('Database unavailable');
  }
});

module.exports = router;
