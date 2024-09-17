export class CustomError extends Error {
    errors: string[];
  
    constructor(errors: string[]) {
      super();
      this.errors = errors;
    }
  }