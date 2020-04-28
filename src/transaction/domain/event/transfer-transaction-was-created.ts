import { DomainEvent } from '../../../core/domain';

export class TransferTransactionWasCreated implements DomainEvent {
  public constructor(
    public readonly id: string,
    public readonly idSender: string,
    public readonly idBeneficiary: string,
    public readonly money: number,
    public readonly currencyCode: string,
  ) {}
}
