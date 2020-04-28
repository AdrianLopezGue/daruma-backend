import { DomainEvent } from '../../../core/domain/models/domain-event';

export class UserNameWasChanged implements DomainEvent {
  constructor(public readonly id: string, public readonly username: string) {}
}
