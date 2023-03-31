const router = require('express').Router();

const { ERROR_ID } = require('../utils/utils');

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use((req, res) => {
  res.status(ERROR_ID).send({ message: 'Данный путь не существует' });
});

module.exports = router;
