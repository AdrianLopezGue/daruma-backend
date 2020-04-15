export class EmptyBillNameError extends Error {
  public static withString(): EmptyBillNameError {
    return new EmptyBillNameError(
      `Bill Name is not valid because it is empty`,
    );
  }
}
