const Item = require("../models/clothingItems");
const {
  InternalServerError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors");
const { InternalServerError } = require("../utils/errors/InternalServerError");

// GET Items
const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch(() => {
      next(new InternalServerError());
    });
};

// POST Item
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const userId = req.user._id;

  Item.create({ name, weather, imageUrl, owner: userId })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      }
      next(new InternalServerError());
    });
};

// DELETE Item
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  Item.findById(itemId)
    .orFail(() => {
      next(new NotFoundError("Clothing item not found"));
    })
    .then((item) => {
      if (!item.owner.equals(userId)) {
        next(
          new ForbiddenError("You do not have permission to delete this card."),
        );
      }
      return item.deleteOne().then(() => {
        res
          .status(200)
          .send({ message: "Clothing item was deleted successfully" });
      });
    })
    .catch((err) => {
      console.error(err.name);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Data"));
      }
      next(new InternalServerError());
    });
};

// Like Item
const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  Item.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      next(new NotFoundError("Clothing item not found"));
    })
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err.name);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Data"));
      }
      next(new InternalServerError());
    });
};

// Dislike Item
const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  Item.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      next(new NotFoundError("Clothing item not found"));
    })
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err.name);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Data"));
      }
      next(new InternalServerError());
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
