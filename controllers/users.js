const User = require("../models/user");
const bcrypt = require('bcrypt');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require("../utils/errors");
const user = require("../models/user");

// GET Users route

const getUsers = (req, res) => {
    User.find({})
        .then((users) => res.send(users))
        .catch((err) => {
            console.error(err);
            res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
        });
};

// GET User

const getUser = (req, res) => {
    const { userId } = req.params;
    User.findById(userId)
        .orFail(() => {
            const error = new Error("User not found");
            error.statusCode = NOT_FOUND;
            throw error;
        })
        .then((user) => res.status(200).send(user))
        .catch((err) => {
            console.error(err.name);
            if(err.name === "CastError") {
                return res.status(BAD_REQUEST).send({message: "Invalid data"})
            } 
            if (err.statusCode) {
                return res.status(err.statusCode).send({ message: err.message})
            }
            return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
        });
}

// POST User

const createUser = (req, res) => {
    const { name, avatar, email, password } = req.body
    bcrypt.hash(password, 10)
    .then(hash => User.create({ name, avatar, email, password: hash })
        .then((user) => res.status(201).send(user))
        .catch((err) => {
            console.error(err)
            if(err.name === "ValidationError") {
                return res.status(BAD_REQUEST).send({message: "Invalid data"})
            }
            if (err.code === 11000) {
                return res.status(BAD_REQUEST).send({ message: "Duplicate email. A user with this email already exists." })
            };
            return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
        })
    )
}

module.exports = { getUsers, getUser, createUser }