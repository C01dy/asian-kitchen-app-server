class CustomHttpError extends Error {
  httpStatusCode;
  timestamp;

  constructor(httpStatusCode, message) {
    if (message) {
      super(message);
    } else {
      super("A generic error occurred!");
    }

    this.httpStatusCode = httpStatusCode;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }
}


module.exports = {
  CustomHttpError: CustomHttpError
}
