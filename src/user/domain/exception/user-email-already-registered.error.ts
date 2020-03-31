export class UserEmailAlreadyRegisteredError extends Error {
  public static withString(userEmail: string): UserEmailAlreadyRegisteredError {
    return new UserEmailAlreadyRegisteredError(
      `UserEmail ${userEmail} already taken.`,
    );
  }
}
