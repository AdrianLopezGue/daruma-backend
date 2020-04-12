import { ValueObject } from '../../../core/domain';

interface Props {
  value: Date;
}

export class ExpenseDate extends ValueObject<Props> {
  public static fromDate(value: Date): ExpenseDate {
    return new this({ value });
  }

  get value() {
    return this.props.value;
  }
}
