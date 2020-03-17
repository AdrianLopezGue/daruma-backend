import { version } from 'uuid-validate';

import { InvalidIdError } from '../exceptions';
import { ValueObject } from './value-object';

interface Props {
  value: string;
}

export abstract class Id extends ValueObject<Props> {
  protected constructor(id: string) {
    if (version(id) !== 4) {
      throw InvalidIdError.withString(id);
    }

    super({ value: id });
  }

  get value(): string {
    return this.props.value;
  }
}
