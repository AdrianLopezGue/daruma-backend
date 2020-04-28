import { ValueObject } from '../../../core/domain';

interface Props {
  value: string;
}

export class UserPaypal extends ValueObject<Props> {
  static fromString(value: string): UserPaypal {
    return new this({ value });
  }

  get value(): string {
    return this.props.value;
  }
}