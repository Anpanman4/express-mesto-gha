const User = require('../models/user');

const SUCCEES_CODE = 200;
const SUCCEES_CREATE = 201;
const ERROR_SERVER = 500;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(SUCCEES_CODE).send({ data: users }))
    .catch((err) => res.status(ERROR_SERVER).send({ message: err.message }));
};

const getUserById = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((users) => res.status(SUCCEES_CODE).send({ data: users }))
    .catch((err) => res.status(ERROR_SERVER).send({ message: err.message }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(SUCCEES_CREATE).send({ data: user }))
    .catch((err) => res.status(ERROR_SERVER).send({ message: err.message }));
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.status(SUCCEES_CODE).send(user))
    .catch((err) => res.status(ERROR_SERVER).send({ message: err.message }));
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.status(SUCCEES_CODE).send(user))
    .catch((err) => res.status(ERROR_SERVER).send({ message: err.message }));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
