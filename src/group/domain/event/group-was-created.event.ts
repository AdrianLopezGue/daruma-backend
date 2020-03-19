import { DomainEvent } from '../../../core/domain';

export class GroupWasCreated implements DomainEvent {
  public constructor(
    public readonly id: string,
    public readonly groupname: string,
    public readonly groupcurrencycode: string,
    public readonly userid: string,
  ) {}
}