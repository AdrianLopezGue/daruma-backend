import { DomainEvent } from '../../../core/domain';

export class ReceiptWasCreated implements DomainEvent {
  constructor(
    public readonly id: string,
    public readonly expenseId: string,
    public readonly date: Date,
    public readonly payers: string[],
    public readonly debtors: string[],
    public readonly money: bigint,
    public readonly currencyCode: string,
  ) {}
}
