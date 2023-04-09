const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes');

const { PORT } = require('./utils/utils');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6432f56a2db0ace430231eb3',
  };

  next();
});
app.use(routes);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
