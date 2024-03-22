const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode).json({ message: err.message });
};

module.exports = { errorHandler };
