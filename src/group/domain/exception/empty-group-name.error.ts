export class EmptyGroupnameError extends Error {
  public static withString(): EmptyGroupnameError {
    return new EmptyGroupnameError(`Groupname is not valid because it is empty`);
  }
}
