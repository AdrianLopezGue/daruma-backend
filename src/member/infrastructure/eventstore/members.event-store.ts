import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { EventStore } from '../../../core/eventstore/eventstore';
import { Members } from '../../domain/repository/members';
import { Member } from '../../domain/model/member';
import { MemberId } from '../../domain/model/member-id';


@Injectable()
export class MemberEventStore implements Members {
  constructor(
    private readonly eventStore: EventStore,
    private readonly publisher: EventPublisher,
  ) {}

  async get(memberId: MemberId): Promise<Member> {
    return this.eventStore.read(Member, memberId.value);
  }

  async find(memberId: MemberId): Promise<Member> | null {
    return this.eventStore.read(Member, memberId.value);
  }

  save(member: Member): void {
    member = this.publisher.mergeObjectContext(member);
    member.commit();
  }
}
