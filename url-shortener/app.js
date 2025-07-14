const express = require('express');
const { loggingMiddleware } = require('./middleware/logger');
const urlRoutes = require('./routes/urlRoutes');

const app = express();

app.use(express.json());
app.use(loggingMiddleware);
app.use('/', urlRoutes);

module.exports = app;

