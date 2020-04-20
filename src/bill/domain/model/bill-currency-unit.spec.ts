import { NegativeCurrencyUnitError } from '../exception/negative-currency-unit.error';
import { BillCurrencyUnit } from './bill-currency-unit';

describe('BillCurrencyUnit', () => {
  it('should be a big int', () => {
    expect(BillCurrencyUnit.fromNumber(100).value).toBe(100);
  });

  it('should not be negative', () => {
    expect(() => {
      BillCurrencyUnit.fromNumber(-10);
    }).toThrow(NegativeCurrencyUnitError);
  });
});
