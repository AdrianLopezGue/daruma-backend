import { DomainEvent } from '../../../core/domain';

export class GroupWasCreated implements DomainEvent {
  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly currencyCode: string,
    public readonly ownerId: string,
  ) {}
}
