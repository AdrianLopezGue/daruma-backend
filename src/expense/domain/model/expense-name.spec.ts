import { ExpenseName } from './expense-name';
import { EmptyExpensenameError } from '../exception/empty-expense-name.error';

describe('Expensename', () => {
  it('creates a new expense name', () => {
    const fullname = ExpenseName.fromString('netflix');

    expect(fullname.value).toBe('netflix');
  });

  it('expects empty expense name exception', () => {
    expect(() => ExpenseName.fromString('')).toThrow(EmptyExpensenameError);
  });
});
