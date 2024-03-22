const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../utils/errors/UnauthorizedError");
const { JWT_SECRET } = require("../utils/config");

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
    next(new UnauthorizedError("Authorization Error"));
  }

  req.user = payload;

  return next();
};

module.exports = { auth };
