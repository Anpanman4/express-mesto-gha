const Card = require('../models/card');

const {
  ERROR_DATA, ERROR_PARAM, ERROR_ID, ERROR_DEFAULT,
} = require('../utils/utils');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      res.status(ERROR_DEFAULT).send({ message: 'Что-то пошло не так' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (card) res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_DATA).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      return res.status(ERROR_DEFAULT).send({ message: 'Что-то пошло не так' });
    });
};

const deleteCard = (req, res) => {
  const { id } = req.params;

  Card.findById(id)
    .then((cardData) => {
      if (!cardData) {
        return res.status(ERROR_ID).send({ message: 'Карточка по ID не найдена' });
      }
      if (cardData.owner.toString() !== req.user._id) {
        return res.status(ERROR_PARAM).send({ message: 'Вы не являетесь владельцем карточки' });
      }
      return Card.findByIdAndDelete(id)
        .then((card) => res.status(200).send(card));
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(ERROR_DATA).send({ message: 'Передан невалидный ID' });
      return res.status(ERROR_DEFAULT).send({ message: 'Что-то пошло не так' });
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
      return res.status(ERROR_ID).send({ message: 'Карточка по ID не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(ERROR_DATA).send({ message: 'Передан невалидный ID' });
      return res.status(ERROR_DEFAULT).send({ message: 'Что-то пошло не так' });
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
      return res.status(ERROR_ID).send({ message: 'Карточка по ID не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(ERROR_DATA).send({ message: 'Передан невалидный ID' });
      return res.status(ERROR_DEFAULT).send({ message: 'Что-то пошло не так' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
