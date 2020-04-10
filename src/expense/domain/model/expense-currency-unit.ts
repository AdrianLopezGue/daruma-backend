import { ValueObject } from '../../../core/domain';
import { NegativeCurrencyUnitError } from '../exception/negative-currency-unit.error';

interface Props {
  value: bigint;
}

export class ExpenseCurrencyUnit extends ValueObject<Props> {
  public static fromBigInt(currencyUnit: bigint): ExpenseCurrencyUnit {
    if (currencyUnit < 0) {
      throw  NegativeCurrencyUnitError.withString();
    }

    return new ExpenseCurrencyUnit({ value: currencyUnit });
  }

  get value(): bigint {
    return this.props.value;
  }
}