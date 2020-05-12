import { DomainEvent } from '../../../core/domain/models/domain-event';

export class BillDateWasChanged implements DomainEvent {
  constructor(public readonly id: string, public readonly date: Date) {}
}
