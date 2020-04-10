export class EmptyExpensenameError extends Error {
  public static withString(): EmptyExpensenameError {
    return new EmptyExpensenameError(
      `Expensename is not valid because it is empty`,
    );
  }
}
