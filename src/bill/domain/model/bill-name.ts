import { ValueObject } from '../../../core/domain';
import { EmptyBillNameError } from '../exception/empty-bill-name.error';

interface Props {
  value: string;
}

export class BillName extends ValueObject<Props> {
  static fromString(value: string): BillName {
    if (value.length === 0) {
      throw new EmptyBillNameError();
    }

    return new this({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
