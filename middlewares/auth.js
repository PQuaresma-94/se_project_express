const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const handleAuthError = (res) => {
    console.error(res);
    res
        .status(UNAUTHORIZED)
        .send({ message: "Authorization Error" })
};

const extractBearerToken = (header) => header.replace("Bearer ", "");

const auth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return handleAuthError(res);
    }

    const token = extractBearerToken(authorization);
    let payload;

    try {
        payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return handleAuthError(res);
    }

    req.user = payload;

    return next();
};

module.exports = { auth }