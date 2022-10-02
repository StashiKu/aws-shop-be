export default class BadRequestError extends Error {
    statusCode: number;

    constructor(message = 'Bad Request', statusCode = 400) {
      super();
      this.statusCode = statusCode;
      this.message = message;
    }
}
