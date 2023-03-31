const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Что-то пошло не так' }));
};

const getUserById = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (user) return res.status(200).send(user);
      return Promise.reject(new Error('Ошибка. Что-то пошло не так...'));
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(404).send({ message: 'Запрашиваемого пользователя не существует' });
      return res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      if (user) return res.status(201).send(user);
      return Promise.reject(new Error('Ошибка. Что-то пошло не так...'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      return res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) return res.status(200).send(user);
      return Promise.reject(new Error('Ошибка. Что-то пошло не так...'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      if (err.name === 'CastError') return res.status(404).send({ message: 'Запрашиваемого пользователя не существует' });
      return res.status(500).send({ message: err.message });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) return res.status(200).send(user);
      return Promise.reject(new Error('Ошибка. Что-то пошло не так...'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      if (err.name === 'CastError') return res.status(404).send({ message: 'Запрашиваемого пользователя не существует' });
      return res.status(500).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
