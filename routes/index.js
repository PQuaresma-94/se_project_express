const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { auth } = require("../middlewares/auth");
const { NOT_FOUND } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");

// No Auth needed

router.post("/signin", login);

router.post("/signup", createUser);

router.use("/items", clothingItemRouter);

// Auth Needed

router.use("/users", auth, userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;