const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { auth } = require("../middlewares/auth");
const { NOT_FOUND } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");

// No Auth needed

router.post("/signin", login);

router.post("/signup", createUser);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

// Auth Needed

router.use(auth)

router.use("/users", userRouter);

router.use("/items", clothingItemRouter);


module.exports = router;