export class ExpenseIdAlreadyRegisteredError extends Error {
  public static withString(expenseId: string): ExpenseIdAlreadyRegisteredError {
    return new ExpenseIdAlreadyRegisteredError(
      `ExpenseId ${expenseId} already taken.`,
    );
  }
}
