import { ExpenseEndPeriodicity } from './expense-end-periodicity';

describe('End Periodicity', () => {
  const newDate: Date = new Date('2019-11-8T16:52:50');

  it('should be created with the value', () => {
    const vo = ExpenseEndPeriodicity.fromDate(newDate);

    expect(vo.value).toBe(newDate);
  });
});
