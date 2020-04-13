import { Id } from '../../../core/domain';
import { v4 as uuid } from 'uuid';

interface Props {
  value: string;
}

export class TransactionId extends Id {
  static generate(): TransactionId {
    return new TransactionId(uuid());
  }

  public static fromString(id: string): TransactionId {
    return new TransactionId(id);
  }

  get value(): string {
    return this.props.value;
  }
}