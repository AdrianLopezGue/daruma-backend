import { CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { Member } from './member';
import { MemberId } from './member-id';
import { MemberName } from './member-name';
import { GroupId } from '../../../group/domain/model/group-id';
import { MemberWasCreated } from '../event/member-was-created.event';
import { UserId } from '../../../user/domain/model/user-id';
import { MemberNameWasChanged } from '../event/member-name-was-changed.event';
import { MemberWasRemoved } from '../event/member-was-removed.event';
import { MemberWasRegisteredAsUser } from '../event/member-was-registered-as-user.event';

describe('Member', () => {
  let member: Member;
  let eventBus$: EventBus;
  let eventPublisher$: EventPublisher;

  const memberId = MemberId.fromString(uuid());
  const groupId = GroupId.fromString(uuid());
  const name = MemberName.fromString('Member Name');
  const userId = UserId.fromString('');

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

  it('can be renamed', () => {
    const newName = MemberName.fromString('New name');
    member = eventPublisher$.mergeObjectContext(member);
    member.rename(newName);
    member.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new MemberNameWasChanged(memberId.value, newName.value),
    );

    expect(member.name.equals(newName)).toBeTruthy();
  });

  it('can set User Id', () => {
    const newUserId = UserId.fromString(uuid());
    member = eventPublisher$.mergeObjectContext(member);
    member.setUserId(newUserId);
    member.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new MemberWasRegisteredAsUser(memberId.value, newUserId.value),
    );

    expect(member.userId.equals(newUserId)).toBeTruthy();
  });

  it('can be removed', () => {
    member = eventPublisher$.mergeObjectContext(member);
    member.remove();
    member.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new MemberWasRemoved(memberId.value),
    );

    expect(member.isRemoved).toBeTruthy();
  });
});
