export class BillIdNotFoundError extends Error {
  public static withString(billId: string): BillIdNotFoundError {
    return new BillIdNotFoundError(`Bill Id ${billId} not found.`);
  }
}
