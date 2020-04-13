import { DomainEvent } from '../../../core/domain';
import { Payer } from '../../../payer/domain/model/payer';
import { Debtor } from '../../../debtor/domain/model/debtor';

export class ReceiptWasCreated implements DomainEvent {
  constructor(
    public readonly id: string,
    public readonly expenseId: string,
    public readonly date: Date,
    public readonly payers: Payer[],
    public readonly debtors: Debtor[],
    public readonly money: bigint,
    public readonly currencyCode: string,
  ) {}
}
