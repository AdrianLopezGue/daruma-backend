
import { DomainEvent } from '../../../core/domain/models/domain-event';

export class BillWasRemoved implements DomainEvent {
  constructor(public readonly id: string) {}
}