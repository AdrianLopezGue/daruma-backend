export class AuthenticationError extends Error {
    public static withString(): AuthenticationError {
        return new AuthenticationError(
        `Error during authentication token id`,
        );
    }
  }