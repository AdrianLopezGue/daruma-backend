export class EmptyUseremailError extends Error {
  public static withString(): EmptyUseremailError {
    return new EmptyUseremailError(
      `User email is not valid because it is empty`,
    );
  }
}
