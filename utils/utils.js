const { PORT = 3000 } = process.env;

const ERROR_DATA = 400;
const ERROR_PARAM = 401;
const ERROR_ID = 404;
const ERROR_DEFAULT = 500;

const JWT_SECRET = 'secret_word';

module.exports = {
  PORT,
  ERROR_DATA,
  ERROR_PARAM,
  ERROR_ID,
  ERROR_DEFAULT,
  JWT_SECRET,
};
