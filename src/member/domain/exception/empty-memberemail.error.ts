export class EmptyMemberemailError extends Error {
  public static withString(): EmptyMemberemailError {
    return new EmptyMemberemailError(
      `Member email is not valid because it is empty`,
    );
  }
}
