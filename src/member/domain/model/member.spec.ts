import { CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';
import { Member } from './member';
import { MemberId } from './member-id';
import { MemberName } from './member-name';
import { GroupId } from '../../../group/domain/model/group-id';
import { MemberWasCreated } from '../event/member-was-created.event';
import { UserId } from '../../../user/domain/model/user-id';

describe('Member', () => {
  let member: Member;
  let eventBus$: EventBus;
  let eventPublisher$: EventPublisher;

  const memberId = MemberId.fromString(v4());
  const groupId = GroupId.fromString(v4());
  const name = MemberName.fromString('Member Name');
  const userId = UserId.fromString('1111');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventBus$.publish = jest.fn();
    eventPublisher$ = module.get<EventPublisher>(EventPublisher);
  });

  it('can be created with id', () => {
    member = eventPublisher$.mergeObjectContext(
      Member.add(memberId, groupId, name, userId),
    );
    member.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new MemberWasCreated(
        memberId.value,
        groupId.value,
        name.value,
        userId.value,
      ),
    );
  });

  it('has an id', () => {
    expect(member.id.equals(memberId)).toBeTruthy();
  });

  it('has an groupId', () => {
    expect(member.groupId.equals(groupId)).toBeTruthy();
  });

  it('has a name', () => {
    expect(member.name.equals(name)).toBeTruthy();
  });

  it('has an userId', () => {
    expect(member.userId.equals(userId)).toBeTruthy();
  });
});
