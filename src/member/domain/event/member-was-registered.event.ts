import { DomainEvent } from '../../../core/domain';

export class MemberWasRegistered implements DomainEvent {
  public constructor(
    public readonly id: string,
    public readonly idGroup: string,
    public readonly membername: string,
    public readonly memberemail: string,
    public readonly idUser: string
  ) {}
}
