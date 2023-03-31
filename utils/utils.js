const { PORT = 3000 } = process.env;

const ERROR_DATA = 400;
const ERROR_ID = 404;
const ERROR_DEFAULT = 500;

module.exports = {
  PORT,
  ERROR_DATA,
  ERROR_ID,
  ERROR_DEFAULT,
};
