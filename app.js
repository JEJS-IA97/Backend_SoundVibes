const express = require('express');
const routes = require('./routes');
const cors = require('cors'); // Importa cors aquí

require('dotenv').config();

const app = express(); // Declara app aquí

app.use(cors({ origin: 'http://localhost:8001' }));
app.use(express.json());
app.use("/api", routes);

const port = 4000;

app.listen(port, () => console.log(`API is running on port ${port}`));
