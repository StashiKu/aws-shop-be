export default class BadRequestError extends Error {
    statusCode: number;
    code: string;

    constructor(message = 'Bad Request', statusCode = 400) {
      super();
      this.statusCode = statusCode;
      this.code = 'BadRequestError';
      this.message = message;
    }
}
