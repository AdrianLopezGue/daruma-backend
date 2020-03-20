import { ValueObject } from '../../../core/domain';
import { EmptyGroupnameError } from '../exception/empty-group-name.error';

interface Props {
  value: string;
}

export class GroupName extends ValueObject<Props> {
  static fromString(value: string): GroupName {
    if (value.length === 0) {
      throw new EmptyGroupnameError();
    }

    return new this({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
