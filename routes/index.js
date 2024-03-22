const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { auth } = require("../middlewares/auth");
const { NotFoundError } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");

// No Auth needed

router.post("/signin", login);

router.post("/signup", createUser);

router.use("/items", clothingItemRouter);

// Auth Needed

router.use("/users", auth, userRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested recource not found."));
});

module.exports = router;
