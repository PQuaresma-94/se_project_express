const Item = require("../models/clothingItems");
const {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  InternalServerError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors");

// GET Items
const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch((err) => {
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
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => {
      if (!item.owner.equals(userId)) {
        const error = new Error(
          "You do not have permission to delete this card.",
        );
        error.statusCode = FORBIDDEN;
        throw error;
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
      if (err.statusCode === FORBIDDEN) {
        next(new ForbiddenError(err.message));
      }
      if (err.statusCode === NOT_FOUND) {
        next(new NotFoundError(err.message));
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
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err.name);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Data"));
      }
      if (err.statusCode === NOT_FOUND) {
        next(new NotFoundError(err.message));
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
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err.name);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Data"));
      }
      if (err.statusCode === NOT_FOUND) {
        next(new NotFoundError(err.message));
      }
      next(new InternalServerError());
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
