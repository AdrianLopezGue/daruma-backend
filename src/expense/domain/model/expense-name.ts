import { ValueObject } from '../../../core/domain';
import { EmptyExpensenameError } from '../exception/empty-expense-name.error';

interface Props {
  value: string;
}

export class ExpenseName extends ValueObject<Props> {
  static fromString(value: string): ExpenseName {
    if (value.length === 0) {
      throw new EmptyExpensenameError();
    }

    return new this({ value });
  }

  get value(): string {
    return this.props.value;
  }
}