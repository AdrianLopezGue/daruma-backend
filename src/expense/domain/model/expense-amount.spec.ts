import { ExpenseCurrencyUnit } from './expense-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model';
import { ExpenseAmount } from './expense-amount';

describe('ExpenseAmount', () => {
  it('should return coordinates', () => {
    const money = ExpenseCurrencyUnit.fromBigInt(BigInt(100));
    const currencyCode = GroupCurrencyCode.fromString('EUR');

    const amount = ExpenseAmount.withMoneyAndCurrencyCode(money, currencyCode);
    expect(amount.money.value).toBe(BigInt(100));
    expect(amount.currencyCode.value).toBe('EUR');
  });
});
