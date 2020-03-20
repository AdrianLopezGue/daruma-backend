export class UserIdAlreadyRegisteredError extends Error {
  public static withString(userId: string): UserIdAlreadyRegisteredError {
    return new UserIdAlreadyRegisteredError(`UserId ${userId} already taken.`);
  }
}
