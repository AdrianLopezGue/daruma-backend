export class MemberMadeTransactionError extends Error {
  public static withString(
    memberId: string,
  ): MemberMadeTransactionError {
    return new MemberMadeTransactionError(
      `Member Id ${memberId} already made a transaction.`,
    );
  }
}