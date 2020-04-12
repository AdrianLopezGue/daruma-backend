import { DomainEvent } from '../../../core/domain';

export class PayerWasCreated implements DomainEvent {
  constructor(
    public readonly id: string,
    public readonly expenseId: string,
    public readonly memberId: string,
    public readonly money: bigint,
    public readonly currencyCode: string,
  ) {}
}
