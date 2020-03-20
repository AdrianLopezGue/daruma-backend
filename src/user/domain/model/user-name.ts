import { ValueObject } from '../../../core/domain';
import { EmptyUsernameError } from '../exception/empty-username.error';

interface Props {
  value: string;
}

export class UserName extends ValueObject<Props> {
  static fromString(value: string): UserName {
    if (value.length === 0) {
      throw new EmptyUsernameError();
    }

    return new this({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
