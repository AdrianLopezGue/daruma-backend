import { Id } from '../../../core/domain';
import { v4 as uuid } from 'uuid';

interface Props {
  value: string;
}

export class DebtorId extends Id {
  static generate(): DebtorId {
    return new DebtorId(uuid());
  }

  public static fromString(id: string): DebtorId {
    return new DebtorId(id);
  }

  get value(): string {
    return this.props.value;
  }
}
