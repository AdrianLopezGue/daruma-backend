import { ValueObject } from '../../../core/domain';
import { ExpenseCurrencyUnit } from './expense-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model';

interface Props {
  money: ExpenseCurrencyUnit;
  currencyCode: GroupCurrencyCode;
}

export class ExpenseAmount extends ValueObject<Props> {
  static withMoneyAndCurrencyCode(money: ExpenseCurrencyUnit, currencyCode: GroupCurrencyCode): ExpenseAmount {
    return new ExpenseAmount({ money, currencyCode });
  }

  get money(): ExpenseCurrencyUnit {
    return this.props.money;
  }

  get currencyCode(): GroupCurrencyCode {
    return this.props.currencyCode;
  }
}