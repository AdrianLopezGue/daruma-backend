import { DomainEvent } from '../../../core/domain/models/domain-event';

export class GroupCurrencyCodeWasChanged implements DomainEvent {
  constructor(
    public readonly id: string,
    public readonly currencyCode: string,
  ) {}
}
