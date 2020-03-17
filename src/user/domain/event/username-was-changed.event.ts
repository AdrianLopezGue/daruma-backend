import { DomainEvent } from '../../../core/domain';

export class UsernameWasChanged implements DomainEvent {
  constructor(public readonly id: string, public readonly username: string) {}
}