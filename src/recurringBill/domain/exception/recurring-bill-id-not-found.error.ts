export class RecurringBillIdNotFoundError extends Error {
    public static withString(recurringBill: string): RecurringBillIdNotFoundError {
      return new RecurringBillIdNotFoundError(`Recurring Bill Id ${recurringBill} not found.`);
    }
  }