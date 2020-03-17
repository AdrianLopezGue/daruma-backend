import { IEvent } from '@nestjs/cqrs';

export interface DomainEvent extends IEvent {
  readonly id: string;
}
