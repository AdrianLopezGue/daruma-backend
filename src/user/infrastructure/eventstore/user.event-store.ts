import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { EventStore } from '../../../core/eventstore/eventstore';
import { Users } from '../../domain/repository/users';
import { User } from '../../domain/model/user';


@Injectable()
export class UserEventStore implements Users {
  constructor(
    private readonly eventStore: EventStore,
    private readonly publisher: EventPublisher,
  ) {}

  save(user: User): void {
    user = this.publisher.mergeObjectContext(user);
    user.commit();
  }
}
