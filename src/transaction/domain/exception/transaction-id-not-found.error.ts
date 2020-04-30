export class TransactionIdNotFoundError extends Error {
  public static withString(transactionId: string): TransactionIdNotFoundError {
    return new TransactionIdNotFoundError(`Transaction Id ${transactionId} not found.`);
  }
}
