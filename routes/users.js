const router = require("express").Router();
const { getCurrentUser, updateUserProfile } = require("../controllers/users");
const { validateUserId } = require("../middlewares/validation");

router.get("/me", validateUserId, getCurrentUser);

router.patch("/me", validateUserId, updateUserProfile);

module.exports = router;
