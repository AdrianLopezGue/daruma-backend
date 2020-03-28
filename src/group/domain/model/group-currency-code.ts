import { ValueObject } from '../../../core/domain';
import { GroupCurrencyCodeLengthError } from '../exception/group-currency-code-length.error';

interface Props {
  value: string;
}

export class GroupCurrencyCode extends ValueObject<Props> {
  static fromString(value: string): GroupCurrencyCode {
    if (value.length !== 3) {
      throw new GroupCurrencyCodeLengthError();
    }

    return new this({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
