import { Id } from '../../../core/domain';
import { v4 as uuid } from 'uuid';

interface Props {
  value: string;
}

export class BillId extends Id {
  static generate(): BillId {
    return new BillId(uuid());
  }

  public static fromString(id: string): BillId {
    return new BillId(id);
  }

  get value(): string {
    return this.props.value;
  }
}
