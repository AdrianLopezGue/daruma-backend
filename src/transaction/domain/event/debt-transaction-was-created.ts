import { DomainEvent } from '../../../core/domain';

export class DebtTransactionWasCreated implements DomainEvent {
  public constructor(
    public readonly id: string,
    public readonly idMember: string,
    public readonly idBill: string,
    public readonly money: number,
    public readonly currencyCode: string,
  ) {}
}
