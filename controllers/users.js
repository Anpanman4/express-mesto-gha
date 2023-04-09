const { hash, compare } = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/user');

const {
  ERROR_DATA, ERROR_PARAM, ERROR_ID, ERROR_DEFAULT, JWT_SECRET,
} = require('../utils/utils');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'Что-то пошло не так' }));
};

const getUserById = (req, res) => {
  const { id } = req.params;

  User.findById(id, { name: 1, about: 1, avatar: 1 })
    .then((user) => {
      if (user) return res.status(200).send(user);
      return res.status(ERROR_ID).send({ message: 'Пользователь по ID не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(ERROR_DATA).send({ message: 'Что-то пошло не так' });
      return res.status(ERROR_DEFAULT).send({ message: 'Что-то пошло не так' });
    });
};

const getUserInfo = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(() => {
      res.status(ERROR_DEFAULT).send({ message: 'Что-то пошло не так' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      compare(password, user.password)
        .then((isMatched) => {
          if (!isMatched) {
            res.status(ERROR_PARAM).send({ message: 'Что-то пошло не так' });
          }
          const jwt = jsonwebtoken.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: '7d',
          });

          res.status(200).send({ token: jwt });
        });
    })
    .catch(() => {
      res.status(ERROR_DEFAULT).send({ message: 'Что-то пошло не так' });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  hash(password, 10)
    .then((hashPassword) => {
      User.create({
        name, about, avatar, email, password: hashPassword,
      })
        .then((user) => {
          if (user) res.status(201).send('Пользователь создан');
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      return res.status(ERROR_DEFAULT).send({ message: 'Что-то пошло не так' });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные для обновления информации.' });
      return res.status(ERROR_DEFAULT).send({ message: err.message });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные для обновления аватара.' });
      return res.status(ERROR_DEFAULT).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUserById,
  getUserInfo,
  login,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
