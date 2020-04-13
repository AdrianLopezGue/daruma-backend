import { Id } from '../../../core/domain';
import { v4 as uuid } from 'uuid';

interface Props {
  value: string;
}

export class ReceiptId extends Id {
  static generate(): ReceiptId {
    return new ReceiptId(uuid());
  }

  public static fromString(id: string): ReceiptId {
    return new ReceiptId(id);
  }

  get value(): string {
    return this.props.value;
  }
}