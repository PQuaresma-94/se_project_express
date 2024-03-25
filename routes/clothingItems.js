const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  validateClothingItemBody,
  validateId,
} = require("../middlewares/validation");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// No Auth Needed

router.get("/", getItems);

// Auth Needed

router.use(auth);

router.post("/", validateClothingItemBody, createItem);

router.delete("/:itemId", validateId, deleteItem);

router.put("/:itemId/likes", validateId, likeItem);

router.delete("/:itemId/likes", validateId, dislikeItem);

module.exports = router;
