import { Id } from '../../../core/domain';
import { v4 as uuid } from 'uuid';

interface Props {
  value: string;
}

export class ExpenseId extends Id {
  static generate(): ExpenseId {
    return new ExpenseId(uuid());
  }

  public static fromString(id: string): ExpenseId {
    return new ExpenseId(id);
  }

  get value(): string {
    return this.props.value;
  }
}
