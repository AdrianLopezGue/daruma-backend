import { ExpensePeriodicity } from './expense-periodicity';
import { InvalidPeriodicityStateError } from '../exception/invalid-periodicity-state.error';

describe('Expense Periodicity', () => {
  let vo: ExpensePeriodicity;

  it('should be created if the value is valid', () => {
    vo = ExpensePeriodicity.fromString('Daily');
    expect(vo.value).toBe('Daily');
  });

  it('should throw an exception if the value is invalid', () => {
    expect(() => ExpensePeriodicity.fromString('Aaa123')).toThrow(
      InvalidPeriodicityStateError,
    );
  });

  it('should create an Dialy Expense Periodicity', () => {
    vo = ExpensePeriodicity.daily();
    expect(vo.value).toBe('Daily');
  });

  it('should create a Close Expense Periodicity', () => {
    vo = ExpensePeriodicity.weekly();
    expect(vo.value).toBe('Weekly');
  });

  it('should create a Close Expense Periodicity', () => {
    vo = ExpensePeriodicity.monthly();
    expect(vo.value).toBe('Monthly');
  });
});
