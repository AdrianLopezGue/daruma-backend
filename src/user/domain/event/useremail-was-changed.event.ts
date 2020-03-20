import { DomainEvent } from '../../../core/domain';

export class UseremailWasChanged implements DomainEvent {
  constructor(public readonly id: string, public readonly useremail: string) {}
}
