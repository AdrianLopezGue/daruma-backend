import { ValueObject } from '../../../core/domain';

interface Props {
  value: Date;
}

export class ExpenseEndPeriodicity extends ValueObject<Props> {
  public static fromDate(value: Date): ExpenseEndPeriodicity {
    return new this({ value });
  }

  get value() {
    return this.props.value;
  }
}