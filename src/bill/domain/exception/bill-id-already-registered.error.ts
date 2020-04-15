export class BillIdAlreadyRegisteredError extends Error {
  public static withString(billId: string): BillIdAlreadyRegisteredError {
    return new BillIdAlreadyRegisteredError(
      `BillId ${billId} already taken.`,
    );
  }
}
