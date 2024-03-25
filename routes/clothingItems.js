const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  validateClothingItemBody,
  validateItemId,
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

router.delete("/:itemId", validateItemId, deleteItem);

router.put("/:itemId/likes", validateItemId, likeItem);

router.delete("/:itemId/likes", validateItemId, dislikeItem);

module.exports = router;
