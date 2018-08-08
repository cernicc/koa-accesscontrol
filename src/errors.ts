export class AuthorizationError extends Error {
  public code: string;
  public message: string;

  constructor(code: string, message: string) {
    super(code);

    this.code = code;
    this.message = message;
  }
}
