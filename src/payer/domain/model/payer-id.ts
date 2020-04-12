import { Id } from '../../../core/domain';
import { v4 as uuid } from 'uuid';

interface Props {
  value: string;
}

export class PayerId extends Id {

  static generate(): PayerId {
    return new PayerId(uuid());
  }

  public static fromString(id: string): PayerId {

    return new PayerId(id);
  }

  get value(): string {
    return this.props.value;
  }
}