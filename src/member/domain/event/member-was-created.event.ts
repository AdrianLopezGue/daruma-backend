import { DomainEvent } from '../../../core/domain';

export class MemberWasCreated implements DomainEvent {
  public constructor(
    public readonly id: string,
    public readonly idGroup: string,
    public readonly membername: string,
    public readonly idUser: string,
  ) {}
}
