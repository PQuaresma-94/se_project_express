const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { auth } = require("../middlewares/auth");
const {
  validateUserInfoBody,
  validateAuthentication,
} = require("../middlewares/validation");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { createUser, login } = require("../controllers/users");

// No Auth needed

router.post("/signin", validateAuthentication, login);

router.post("/signup", validateUserInfoBody, createUser);

router.use("/items", clothingItemRouter);

// Auth Needed

router.use("/users", auth, userRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested recource not found."));
});

module.exports = router;
