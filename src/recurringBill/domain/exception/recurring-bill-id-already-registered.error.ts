export class RecurringBillIdAlreadyRegisteredError extends Error {
    public static withString(recurringBillId: string): RecurringBillIdAlreadyRegisteredError {
      return new RecurringBillIdAlreadyRegisteredError(`RecurringBill ${recurringBillId} already taken.`);
    }
  }