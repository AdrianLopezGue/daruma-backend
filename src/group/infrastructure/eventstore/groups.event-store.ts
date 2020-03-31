import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { EventStore } from '../../../core/eventstore/eventstore';
import { Group } from '../../domain/model/group';
import { GroupId } from '../../domain/model/group-id';
import { Groups } from '../../domain/repository/groups';

@Injectable()
export class GroupEventStore implements Groups {
  constructor(
    private readonly eventStore: EventStore,
    private readonly publisher: EventPublisher,
  ) {}

  async get(groupId: GroupId): Promise<Group> {
    return this.eventStore.read(Group, groupId.value);
  }

  async find(groupId: GroupId): Promise<Group> | null {
    return this.eventStore.read(Group, groupId.value);
  }

  save(group: Group): void {
    group = this.publisher.mergeObjectContext(group);
    group.commit();
  }

  nextIdentity(): GroupId {
    return GroupId.generate();
  }
}
