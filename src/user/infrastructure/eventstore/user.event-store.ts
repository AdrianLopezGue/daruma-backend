import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { EventStore } from '../../../core/eventstore/eventstore';
import { Users } from '../../domain/repository/users';
import { User } from '../../domain/model/user';
import { UserId } from '../../domain/model/user-id';


@Injectable()
export class UserEventStore implements Users {
  constructor(
    private readonly eventStore: EventStore,
    private readonly publisher: EventPublisher,
  ) {}

  async get(userId: UserId): Promise<User> {
    return this.eventStore.read(User, userId.value);
  }

  async find(userId: UserId): Promise<User> | null {
    return this.eventStore.read(User, userId.value);
  }

  save(user: User): void {
    user = this.publisher.mergeObjectContext(user);
    user.commit();
  }
}
