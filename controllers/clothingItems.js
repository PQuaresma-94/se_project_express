const Item = require("../models/clothingItems");

// GET Items 
const getItems = (req, res) => {
    Item.find({})
        .then((items) => res.status(200).send(items))
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: err.message });
        });
};

// POST Item
const createItem = (req, res) => {
    const { name, weather, imageUrl } = req.body;
    Item.create({ name, weather, imageUrl })
        .then((item) => res.status(201).send(item))
        .catch((err) => {
            console.error(err);
            if (err.name === "ValidationError") {
                return res.status(400).send({ message: err.message });
            }
            return res.status(500).send({ message: err.message });
        });
};

// DELETE Item
const deleteItem = (req, res) => {
    const itemId = req.params.itemId;

    Item.findByIdAndRemove(itemId)
        .then((item) => {
            if (!item) {
                return res.status(404).send({ message: 'Item not found' });
            }
            res.status(200).send({ message: 'Item deleted successfully' });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: err.message });
        });
};

module.exports = { getItems, createItem, deleteItem };