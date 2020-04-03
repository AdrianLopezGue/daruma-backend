import { ValueObject } from '../../../core/domain';
import { EmptyMembernameError } from '../exception/empty-membername.error';

interface Props {
  value: string;
}

export class MemberName extends ValueObject<Props> {
  static fromString(value: string): MemberName {
    if (value.length === 0) {
      throw new EmptyMembernameError();
    }

    return new this({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
