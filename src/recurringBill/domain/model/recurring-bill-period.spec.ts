import { RecurringBillPeriod, PeriodTypes } from './recurring-bill-period';
import { RecurringBillPeriodNotValidError } from '../exception/recurring-bill-period-not-valid.error';

describe('RecurringBillPeriod', () => {
  it('should be daily period', () => {
    const period = RecurringBillPeriod.daily();

    expect(period.value).toBe(PeriodTypes.Daily);
  });

  it('should be weekly period', () => {
    const period = RecurringBillPeriod.weekly();

    expect(period.value).toBe(PeriodTypes.Weekly);
  });

  it('should be monthly period', () => {
    const period = RecurringBillPeriod.monthly();

    expect(period.value).toBe(PeriodTypes.Monthly);
  });

  it('should be anually period', () => {
    const period = RecurringBillPeriod.anually();

    expect(period.value).toBe(PeriodTypes.Anually);
  });

  it('can not create an invalid type', () => {
    expect(() => RecurringBillPeriod.fromNumber(6)).toThrow(
      RecurringBillPeriodNotValidError,
    );
  });
});
