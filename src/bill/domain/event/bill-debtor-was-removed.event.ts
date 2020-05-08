import { DomainEvent } from '../../../core/domain/models/domain-event';

export class BillDebtorWasRemoved implements DomainEvent {
  constructor(public readonly id: string, public readonly debtorId: string) {}
}