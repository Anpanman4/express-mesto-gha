const { hash, compare } = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/user');

const SyntexError = require('../errors/syntex-err');
const NotFoundError = require('../errors/not-found-err');
const AuthError = require('../errors/auth-err');
const AlreadyCreatedError = require('../errors/already-created-err');

const { JWT_SECRET } = require('../utils/utils');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { id } = req.params;

  User.findById(id, { name: 1, about: 1, avatar: 1 })
    .then((user) => {
      if (user) res.status(200).send(user);
      next(new NotFoundError('Пользователь по ID не найден'));
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new SyntexError('Что-то пошло не так'));
      next(err);
    });
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      compare(password, user.password)
        .then((isMatched) => {
          if (!isMatched) {
            next(new AuthError('Требуется авторизация'));
          }
          const jwt = jsonwebtoken.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: '7d',
          });

          res.status(200).send({ token: jwt });
        })
        .catch(next);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
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
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new AlreadyCreatedError('Пользователь с таким Email уже зарегистрирован'));
          }
          if (err.name === 'ValidationError') {
            next(new SyntexError('Переданы некорректные данные при создании пользователя.'));
          }
          next(err);
        });
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new SyntexError('Переданы некорректные данные для обновления информации.'));
      next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new SyntexError('Переданы некорректные данные для обновления информации.'));
      next(err);
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
