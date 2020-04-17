export class FirebaseAuthenticationError extends Error {
  public static withString(): FirebaseAuthenticationError {
    return new FirebaseAuthenticationError(
      `Error during authentication token id`,
    );
  }
}
