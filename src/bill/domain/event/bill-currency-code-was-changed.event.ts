import { DomainEvent } from '../../../core/domain/models/domain-event';

export class BillCurrencyCodeWasChanged implements DomainEvent {
  constructor(public readonly id: string, public readonly currencyCode: string) {}
}