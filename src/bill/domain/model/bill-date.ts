import { ValueObject } from '../../../core/domain';

interface Props {
  value: Date;
}

export class BillDate extends ValueObject<Props> {
  public static fromDate(value: Date): BillDate {
    return new this({ value });
  }

  get value() {
    return this.props.value;
  }
}
