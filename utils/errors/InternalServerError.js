class InternalServerError extends Error {
  constructor() {
    super();
    this.message = "An error has occurred on the server.";
    this.name = this.constructor.name;
    this.statusCode = 500;
  }
}

module.exports = {
  InternalServerError,
};
