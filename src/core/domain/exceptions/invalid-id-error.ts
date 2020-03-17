export class InvalidIdError extends Error {
  private constructor(stack?: string) {
    super(stack);
  }

  public static withString(value: string): InvalidIdError {
    return new InvalidIdError(`${value} is not a valid uuid v4.`);
  }
}
