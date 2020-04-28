import { DomainEvent } from '../../../core/domain/models/domain-event';

export class UserPaypalWasChanged implements DomainEvent {
  constructor(
      public readonly id: string,
      public readonly userpaypal: string,
      ) {}
}