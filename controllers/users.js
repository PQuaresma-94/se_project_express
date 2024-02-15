const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { BAD_REQUEST, UNAUTHORIZED, NOT_FOUND, CONFLICT, INTERNAL_SERVER_ERROR } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config")

// GET Users (To Be Remove)

const getUsers = (req, res) => {
    User.find({})
        .then((users) => res.send(users))
        .catch((err) => {
            console.error(err);
            res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
        });
};

// GET User (To Be Remove)

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

// Create New User

const createUser = (req, res) => {
    const { name, avatar, email, password } = req.body

    User.findOne({ email })
    .then((existingUser) => {
        if (existingUser) {
            return res.status(CONFLICT).send({message: "A user with this email already exists."})
        }
        return bcrypt.hash(password, 10)
    })
    
    .then((hash) => User.create({ name, avatar, email, password: hash })
        .then((user) => {
            const userData = user.toObject();
            delete userData.password;

            res.status(201).send({userData})
        })
        .catch((err) => {
            console.error(err)
            if(err.name === "ValidationError") {
                return res.status(BAD_REQUEST).send({message: "Invalid data"})
            }
            if (err.status === CONFLICT) {
                return res.status(CONFLICT).send({ message: "Duplicate email. A user with this email already exists." })
            };
            return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
        })
    )
}

// Login User

const login = (req, res) => {
    const { email, password } = req.body;

    if ( !email || !password ) {
        return res
            .status(BAD_REQUEST)
            .send({ message: "Invalid data" });
    }

    return User.findUserByCredentials( email, password )
    .then((user) => {
        console.log(user)
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
        res.send({ token });
    })
    .catch((err) => {
        console.error(err)
        res
            .status(UNAUTHORIZED)
            .send({ message: "Authorization Error login" });
    });
}

// Get Current User

const getCurrentUser = (req, res) => {
    const userId = req.user._id
    User.findById(userId)
        .then((currentUser) => {
            if (!currentUser) {
                return Promise.reject(new Error('User Not Found'));
            }
            res.send({currentUser});
        })
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
};

// Update Profile

const updateUserProfile = (req, res) => {
    const { name, avatar } = req.body;

    User.findByIdAndUpdate(
        req.user._id, 
        { name, avatar },
        {new: true, runValidators: true}
    )
    .then((updateUser) => {
        res.send({updateUser})
    })
    .catch((err) => {
        console.error(err)
        if(err.name === "ValidationError") {
            return res.status(BAD_REQUEST).send({message: "Invalid data"})
        }
        return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
    })
}


module.exports = { getCurrentUser, createUser, login, updateUserProfile }