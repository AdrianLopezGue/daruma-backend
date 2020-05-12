import { DomainEvent } from '../../../core/domain/models/domain-event';

export class BillPayerWasRemoved implements DomainEvent {
  constructor(public readonly id: string, public readonly payerId: string) {}
}
