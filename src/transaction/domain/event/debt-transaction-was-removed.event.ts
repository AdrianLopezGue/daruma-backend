import { DomainEvent } from '../../../core/domain/models/domain-event';

export class DebtTransactionWasRemoved implements DomainEvent {
  constructor(public readonly id: string, public readonly money: number) {}
}
