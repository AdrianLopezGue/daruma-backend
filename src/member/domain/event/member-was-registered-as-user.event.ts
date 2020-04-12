import { DomainEvent } from '../../../core/domain/models/domain-event';

export class MemberWasRegisteredAsUser implements DomainEvent {
  constructor(public readonly id: string, public readonly idUser: string) {}
}
