
import { DomainEvent } from '../../../core/domain/models/domain-event';

export class RecurringBillWasRemoved implements DomainEvent {
  constructor(public readonly id: string) {}
}