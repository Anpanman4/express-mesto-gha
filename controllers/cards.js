const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  if (name === undefined || link === undefined) return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (card) return res.status(201).send(card);
      return Promise.reject(new Error('Ошибка. Что-то пошло не так...'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      return res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

const deleteCard = (req, res) => {
  const { id } = req.params;

  Card.findByIdAndDelete(id)
    .then((card) => {
      if (card) return res.status(200).send(card);
      return Promise.reject(new Error('Ошибка. Что-то пошло не так...'));
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(404).send({ message: 'Запрашиваемого пользователя не существует' });
      return res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) return res.status(200).send(card);
      return Promise.reject(new Error('Ошибка. Что-то пошло не так...'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      if (err.name === 'CastError') return res.status(404).send({ message: 'Запрашиваемого пользователя не существует' });
      return res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) return res.status(200).send(card);
      return Promise.reject(new Error('Ошибка. Что-то пошло не так...'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      if (err.name === 'CastError') return res.status(404).send({ message: 'Запрашиваемого пользователя не существует' });
      return res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
