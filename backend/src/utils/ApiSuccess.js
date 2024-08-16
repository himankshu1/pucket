class ApiSuccess {
  constructor(statusCode, data, message = "Request successfully served") {
    this.success = true;
    this.statusCode = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

export { ApiSuccess };
