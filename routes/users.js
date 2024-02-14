const router = require("express").Router();
const { getUser } = require("../controllers/users");

router.get("/:userId", getUser);

// router.get("/me", getCurrentUser);

module.exports = router;
