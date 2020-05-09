export class RecurringBillPeriodNotValidError extends Error {
    static withType(periodtype: number): RecurringBillPeriodNotValidError {
      return new this(`Period type ${periodtype} not valid.`);
    }
  }