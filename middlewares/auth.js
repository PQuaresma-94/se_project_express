const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");
const { UnauthorizedError } = require("../utils/errors/UnauthorizedError");
const { JWT_SECRET } = require("../utils/config");

const handleAuthError = (res, next) => {
  next(new UnauthorizedError("Authorization Error"));
};

const extractBearerToken = (header) => header.replace("Bearer ", "");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res, next);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res, next);
  }

  req.user = payload;

  return next();
};

module.exports = { auth };
