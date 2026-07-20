require('dotenv').config();

const express = require('express');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use('/', routes);

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
