import { ValueObject } from '../../../core/domain';
import { NegativeCurrencyUnitError } from '../exception/negative-currency-unit.error';

interface Props {
  value: number;
}

export class BillCurrencyUnit extends ValueObject<Props> {
  public static fromNumber(currencyUnit: number): BillCurrencyUnit {
    if (currencyUnit < 0) {
      throw NegativeCurrencyUnitError.withString();
    }

    return new BillCurrencyUnit({ value: currencyUnit });
  }

  get value(): number {
    return this.props.value;
  }
}
