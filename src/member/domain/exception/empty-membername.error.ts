export class EmptyMembernameError extends Error {
  public static withString(): EmptyMembernameError {
    return new EmptyMembernameError(`Member is not valid because it is empty`);
  }
}
