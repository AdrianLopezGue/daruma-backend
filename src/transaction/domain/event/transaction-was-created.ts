import { DomainEvent } from '../../../core/domain';

export class TransactionWasCreated implements DomainEvent {
  constructor(
    public readonly id: string,
    public readonly memberId: string,
    public readonly money: bigint,
    public readonly currencyCode: string,
  ) {}
}
