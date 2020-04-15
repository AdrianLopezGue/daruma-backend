import { ValueObject } from '../../../core/domain';
import { NegativeCurrencyUnitError } from '../exception/negative-currency-unit.error';

interface Props {
  value: bigint;
}

export class BillCurrencyUnit extends ValueObject<Props> {
  public static fromBigInt(currencyUnit: bigint): BillCurrencyUnit {
    if (currencyUnit < 0) {
      throw NegativeCurrencyUnitError.withString();
    }

    return new BillCurrencyUnit({ value: currencyUnit });
  }

  get value(): bigint {
    return this.props.value;
  }
}
