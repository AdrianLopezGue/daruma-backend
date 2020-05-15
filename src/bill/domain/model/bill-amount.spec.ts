import { GroupCurrencyCode } from '../../../group/domain/model';
import { BillCurrencyUnit } from './bill-currency-unit';
import { BillAmount } from './bill-amount';

describe('BillAmount', () => {
  it('should return amount', () => {
    const money = BillCurrencyUnit.fromNumber(100);
    const currencyCode = GroupCurrencyCode.fromString('EUR');

    const amount = BillAmount.withMoneyAndCurrencyCode(money, currencyCode);
    expect(amount.money.value).toBe(100);
    expect(amount.currencyCode.value).toBe('EUR');
  });
});
