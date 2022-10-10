export default class NotFoundError extends Error {
  statusCode: number;
  code: string;

  constructor(message = 'Not Found Error', statusCode = 404) {
    super();
    this.code = 'NotFoundError',
    this.statusCode = statusCode;
    this.message = message;
  }
}
