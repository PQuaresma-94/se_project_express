const Item = require("../models/clothingItems");
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require("../utils/errors");

// GET Items 
const getItems = (req, res) => {
    Item.find({})
        .then((items) => res.send(items))
        .catch((err) => {
            console.error(err);
            res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
        });
};

// POST Item
const createItem = (req, res) => {
    const { name, weather, imageUrl } = req.body;
    const userId = req.user._id;

    Item.create({ name, weather, imageUrl, owner: userId })
        .then((item) => res.status(201).send(item))
        .catch((err) => {
            console.error(err);
            if (err.name === "ValidationError") {
                return res.status(BAD_REQUEST).send({ message: "Invalid data" });
            }
            return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
        });
};

// DELETE Item
const deleteItem = (req, res) => {
    const { itemId } = req.params;

    Item.findByIdAndDelete(itemId)
        .orFail(() => {
            const error = new Error('Clothing item not found');
            error.statusCode = NOT_FOUND;
            throw error;
        })
        .then(() => res.status(200).send({ message: "Clothing item was deleted successfully" }))
        .catch((err) => {
            console.error(err.name);
            if(err.name === "CastError") {
                return res.status(BAD_REQUEST).send({ message: "Invalid data" });
            } 
            if (err.statusCode) {
                return res.status(err.statusCode).send({ message: err.message})
            }
            return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
        });
};

// Like Item
const likeItem = (req, res) => {
    const { itemId } = req.params;

    Item.findByIdAndUpdate(
        itemId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
    )
    .orFail(() => {
        const error = new Error('Clothing item not found');
        error.statusCode = NOT_FOUND;
        throw error;
    })
    .then(() => res.status(200).send({ message: "User has liked this item" }))
    .catch((err) => {
        console.error(err.name);
        if(err.name === "CastError") {
            return res.status(BAD_REQUEST).send({ message: "Invalid data" });
        }
        if (err.statusCode) {
            return res.status(err.statusCode).send({ message: err.message})
        }
        return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
    });
};

// Dislike Item
const dislikeItem = (req, res) => {
    const { itemId } = req.params;

    Item.findByIdAndUpdate(
        itemId,
        { $pull: { likes: req.user._id } },
        { new: true },
    )
    .orFail(() => {
        const error = new Error('Clothing item not found');
        error.statusCode = NOT_FOUND;
        throw error;
    })
    .then(() => res.status(200).send({ message: "User has disliked this item" }))
    .catch((err) => {
        console.error(err.name);
        if(err.name === "CastError") {
            return res.status(BAD_REQUEST).send({ message: "Invalid data" });
        } 
        if (err.statusCode) {
            return res.status(err.statusCode).send({ message: err.message})
        }
        return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
