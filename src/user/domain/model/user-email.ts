import { ValueObject } from '../../../core/domain';
import { EmptyUseremailError } from '../exception/empty-useremail.error';

interface Props {
  value: string;
}

export class UserEmail extends ValueObject<Props> {
  static fromString(value: string): UserEmail {
    if (value.length === 0) {
      throw new EmptyUseremailError();
    }

    return new this({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
