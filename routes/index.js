const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");
const { createUser } = require("../controllers/users");

router.use("/users", userRouter);

router.use("/items", clothingItemRouter);

// router.post("/signin", login);

router.post("/signup", createUser);

router.use((req, res) => {
    res.status(NOT_FOUND).send({ message: "Requested resource not found" });
  });

module.exports = router;