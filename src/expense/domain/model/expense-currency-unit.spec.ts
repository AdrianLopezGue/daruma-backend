import { ExpenseCurrencyUnit } from './expense-currency-unit';
import { NegativeCurrencyUnitError } from '../exception/negative-currency-unit.error';

describe('ExpenseCurrencyUnit', () => {
  it('should be a big int', () => {
    expect(ExpenseCurrencyUnit.fromBigInt(BigInt(100)).value).toBe(BigInt(100));
  });

  it('should not be negative', () => {
    expect(() => {
      ExpenseCurrencyUnit.fromBigInt(BigInt(-10));
    }).toThrow(NegativeCurrencyUnitError);
  });
});
