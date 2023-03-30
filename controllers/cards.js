const Card = require('../models/card');

const SUCCEES_CODE = 200;
const SUCCEES_CREATE = 201;
const ERROR_NOTDATAS = 400;
const ERROR_NOTFOUND = 404;
const ERROR_SERVER = 500;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(SUCCEES_CODE).send(cards))
    .catch((err) => res.status(ERROR_SERVER).send({ message: err.message }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id }, {
    runValidators: true,
  })
    .then((card) => {
      if (card) {
        res.status(SUCCEES_CREATE).send(card);
      } else {
        res.status(ERROR_NOTDATAS).send({ message: 'Ошибка валидации запроса' });
      }
    })
    .catch((err) => res.status(ERROR_SERVER).send({ message: err.message }));
};

const deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndDelete(id)
    .then((card) => {
      if (card) {
        res.status(SUCCEES_CODE).send(card);
      } else {
        res.status(ERROR_NOTFOUND).send({ message: 'Запрашиваемая карточка не найдена' });
      }
    })
    .catch((err) => res.status(ERROR_SERVER).send({ message: err.message }));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(SUCCEES_CODE).send(card);
      } else {
        res.status(ERROR_NOTFOUND).send({ message: 'Данной карточки не существует' });
      }
    })
    .catch((err) => res.status(ERROR_SERVER).send({ message: err.message }));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(SUCCEES_CODE).send(card);
      } else {
        res.status(ERROR_NOTFOUND).send({ message: 'Данной карточки не существует' });
      }
    })
    .catch((err) => res.status(ERROR_SERVER).send({ message: err.message }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
