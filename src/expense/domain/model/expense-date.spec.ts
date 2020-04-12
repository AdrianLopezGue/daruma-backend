import { ExpenseDate } from './expense-date';

describe('Expense Date', () => {
  const newDate: Date = new Date('2019-11-8T16:52:50');

  it('should be created with the value', () => {
    const vo = ExpenseDate.fromDate(newDate);

    expect(vo.value).toBe(newDate);
  });
});
