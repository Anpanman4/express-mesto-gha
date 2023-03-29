const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// const routes = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(routes);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
