export class EmptyUsernameError extends Error {
  public static withString(): EmptyUsernameError {
    return new EmptyUsernameError(`Username is not valid because it is empty`);
  }
}
