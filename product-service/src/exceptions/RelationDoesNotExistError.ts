export default class RelationDoesNotExistError extends Error {
    statusCode: number;
    code: string;
  
    constructor(message = 'Relation does not exist', statusCode = 404) {
      super();
      this.code = 'RelationDoesNotExist',
      this.statusCode = statusCode;
      this.message = message;
    }
}
  
