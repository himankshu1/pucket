class ApiError extends Error {
  constructor(
    statusCode,
    message = "something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.message = message;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // method defining how the object is serialized to JSON
  toJSON() {
    return {
      statusCode: this.statusCode,
      success: this.success,
      message: this.message,
      errors: this.errors,
    };
  }
}

export { ApiError };
