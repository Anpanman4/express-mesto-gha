const router = require('express').Router();

const auth = require('../middlewares/auth');
const { ERROR_ID } = require('../utils/utils');

const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { login, createUser } = require('../controllers/users');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use((req, res) => {
  res.status(ERROR_ID).send({ message: 'Данный путь не существует' });
});

module.exports = router;
