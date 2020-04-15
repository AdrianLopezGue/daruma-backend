import { NegativeCurrencyUnitError } from '../exception/negative-currency-unit.error';
import { BillCurrencyUnit } from './bill-currency-unit';

describe('BillCurrencyUnit', () => {
  it('should be a big int', () => {
    expect(BillCurrencyUnit.fromBigInt(BigInt(100)).value).toBe(BigInt(100));
  });

  it('should not be negative', () => {
    expect(() => {
      BillCurrencyUnit.fromBigInt(BigInt(-10));
    }).toThrow(NegativeCurrencyUnitError);
  });
});
