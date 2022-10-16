export default class NotFoundError extends Error {
  statusCode: number;

  constructor(message = 'Bad Request', statusCode = 404) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
