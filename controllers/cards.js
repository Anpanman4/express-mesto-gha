const Card = require('../models/card');

const SyntexError = require('../errors/syntex-err');
const NotFoundError = require('../errors/not-found-err');
const AuthError = require('../errors/auth-err');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (card) res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new SyntexError('Переданы некорректные данные при создании карточки.'));
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;

  Card.findById(id)
    .then((cardData) => {
      if (!cardData) {
        next(new NotFoundError('Карточка по ID не найдена'));
      }
      if (cardData.owner.toString() !== req.user._id) {
        next(new AuthError('Вы не являетесь владельцем карточки'));
      }
      return Card.findByIdAndDelete(id)
        .then((card) => res.status(200).send(card))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new SyntexError('Передан невалидный ID'));
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) return res.status(200).send(card);
      return next(new NotFoundError('Карточка по ID не найдена'));
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new SyntexError('Передан невалидный ID'));
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) return res.status(200).send(card);
      return next(new NotFoundError('Карточка по ID не найдена'));
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new SyntexError('Передан невалидный ID'));
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
