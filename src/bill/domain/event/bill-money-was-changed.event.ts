import { DomainEvent } from '../../../core/domain/models/domain-event';

export class BillMoneyWasChanged implements DomainEvent {
  constructor(public readonly id: string, public readonly money: number) {}
}