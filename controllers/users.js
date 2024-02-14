const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BAD_REQUEST, UNAUTHORIZED, NOT_FOUND, INTERNAL_SERVER_ERROR } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config")

// GET Users

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

// Login User

const login = (req, res) => {
    const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
        console.log(user)
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
        res.send({ token });
    })
    .catch((err) => {
        console.error(err)
        res
            .status(UNAUTHORIZED)
            .send({ message: "Authorization Error" });
    });
}

module.exports = { getUsers, getUser, createUser, login }