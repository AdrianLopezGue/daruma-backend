import { CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import { GroupWasCreated, GroupNameWasChanged } from '../event';
import { Group } from './group';
import { GroupId } from './group-id';
import { GroupName } from './group-name';
import { GroupCurrencyCode } from './group-currency-code';
import { UserId } from '../../../user/domain/model';
import { GroupWasRemoved } from '../event/group-was-removed.event';
import { GroupCurrencyCodeWasChanged } from '../event/group-currency-code-was-changed.event';

describe('Group', () => {
  let group: Group;
  let eventBus$: EventBus;
  let eventPublisher$: EventPublisher;

  const groupId = GroupId.fromString(uuid());
  const ownerId = UserId.fromString(uuid());
  const name = GroupName.fromString('Group Name');
  const currencyCode = GroupCurrencyCode.fromString('EUR');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventBus$.publish = jest.fn();
    eventPublisher$ = module.get<EventPublisher>(EventPublisher);
  });

  it('can be created', () => {
    group = eventPublisher$.mergeObjectContext(
      Group.add(groupId, name, currencyCode, ownerId),
    );
    group.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new GroupWasCreated(
        groupId.value,
        name.value,
        currencyCode.value,
        ownerId.value,
      ),
    );
  });

  it('has an id', () => {
    expect(group.id.equals(groupId)).toBeTruthy();
  });

  it('has a name', () => {
    expect(group.name.equals(name)).toBeTruthy();
  });

  it('has a currency code', () => {
    expect(group.currencyCode.equals(currencyCode)).toBeTruthy();
  });

  it('has an owner', () => {
    expect(group.ownerId.equals(ownerId)).toBeTruthy();
  });

  it('can be renamed', () => {
    const newName = GroupName.fromString('New name');
    group = eventPublisher$.mergeObjectContext(group);
    group.rename(newName);
    group.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new GroupNameWasChanged(groupId.value, newName.value),
    );

    expect(group.name.equals(newName)).toBeTruthy();
  });

  it('currency code can be changed', () => {
    const newCurrencyCode = GroupCurrencyCode.fromString('NEW');
    group = eventPublisher$.mergeObjectContext(group);
    group.changeCurrencyCode(newCurrencyCode);
    group.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new GroupCurrencyCodeWasChanged(groupId.value, newCurrencyCode.value),
    );

    expect(group.currencyCode.equals(newCurrencyCode)).toBeTruthy();
  });

  it('can be removed', () => {
    group = eventPublisher$.mergeObjectContext(group);
    group.remove();
    group.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new GroupWasRemoved(groupId.value),
    );

    expect(group.isRemoved).toBeTruthy();
  });
});
