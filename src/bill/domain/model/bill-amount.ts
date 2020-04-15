import { ValueObject } from '../../../core/domain';
import { GroupCurrencyCode } from '../../../group/domain/model';
import { BillCurrencyUnit } from './bill-currency-unit';

interface Props {
  money: BillCurrencyUnit;
  currencyCode: GroupCurrencyCode;
}

export class BillAmount extends ValueObject<Props> {
  static withMoneyAndCurrencyCode(
    money: BillCurrencyUnit,
    currencyCode: GroupCurrencyCode,
  ): BillAmount {
    return new BillAmount({ money, currencyCode });
  }

  get money(): BillCurrencyUnit {
    return this.props.money;
  }

  get currencyCode(): GroupCurrencyCode {
    return this.props.currencyCode;
  }
}
