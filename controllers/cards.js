const Card = require('../models/card');

const SUCCEES_CODE = 200;
const SUCCEES_CREATE = 201;
const ERROR_SERVER = 500;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(SUCCEES_CODE).send(cards))
    .catch((err) => res.status(ERROR_SERVER).send({ message: err.message }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(SUCCEES_CREATE).send(card))
    .catch((err) => res.status(ERROR_SERVER).send({ message: err.message }));
};

const deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndDelete(id)
    .then(() => res.status(SUCCEES_CODE).send('Карточка успешно удалена'))
    .catch((err) => res.status(ERROR_SERVER).send({ message: err.message }));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then(() => res.status(SUCCEES_CODE).send('Лайк успешно поставлен'))
    .catch((err) => res.status(ERROR_SERVER).send({ message: err.message }));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(() => res.status(SUCCEES_CODE).send('Лайк успешно убран'))
    .catch((err) => res.status(ERROR_SERVER).send({ message: err.message }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
