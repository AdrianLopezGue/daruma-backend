import { ValueObject } from '../../../core/domain';
import { EmptyMemberemailError } from '../exception/empty-memberemail.error';

interface Props {
  value: string;
}

export class MemberEmail extends ValueObject<Props> {
  static fromString(value: string): MemberEmail {
    if (value.length === 0) {
      throw new EmptyMemberemailError();
    }

    return new this({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
