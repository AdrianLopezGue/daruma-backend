import { DomainEvent } from '../../../core/domain';

export class UserWasRegistered implements DomainEvent {
  public constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly useremail: string,
  ) {}
}
