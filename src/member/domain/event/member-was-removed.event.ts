import { DomainEvent } from '../../../core/domain/models/domain-event';

export class MemberWasRemoved implements DomainEvent {
  constructor(public readonly id: string) {}
}
