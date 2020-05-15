import { CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import { UserWasCreated } from '../event';
import { User } from './user';
import { UserName } from './user-name';
import { UserEmail } from './user-email';
import { UserId } from './user-id';
import { UserPaypal } from './user-paypal';
import { UserNameWasChanged } from '../event/user-name-was-changed.event';
import { UserPaypalWasChanged } from '../event/user-paypal-was-changed.event';

describe('User', () => {
  let user: User;
  let eventBus$: EventBus;
  let eventPublisher$: EventPublisher;

  const userId = UserId.fromString(uuid());
  const name = UserName.fromString('User Name');
  const email = UserEmail.fromString('User Email');
  const paypal = UserPaypal.fromString('');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
    }).compile();

    eventBus$ = module.get<EventBus>(EventBus);
    eventBus$.publish = jest.fn();
    eventPublisher$ = module.get<EventPublisher>(EventPublisher);
  });

  it('can be created', () => {
    user = eventPublisher$.mergeObjectContext(User.add(userId, name, email));
    user.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new UserWasCreated(userId.value, name.value, email.value, ''),
    );
  });

  it('has an id', () => {
    expect(user.id.equals(userId)).toBeTruthy();
  });

  it('has a name', () => {
    expect(user.name.equals(name)).toBeTruthy();
  });

  it('has an email', () => {
    expect(user.email.equals(email)).toBeTruthy();
  });

  it('not has a paypal', () => {
    expect(user.paypal.equals(paypal)).toBeTruthy();
  });

  it('can be renamed', () => {
    const newName = UserName.fromString('New name');
    user = eventPublisher$.mergeObjectContext(user);
    user.rename(newName);
    user.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new UserNameWasChanged(userId.value, newName.value),
    );

    expect(user.name.equals(newName)).toBeTruthy();
  });

  it('can set paypal name', () => {
    const newPaypal = UserPaypal.fromString('New paypal');
    user = eventPublisher$.mergeObjectContext(user);
    user.changePaypal(newPaypal);
    user.commit();

    expect(eventBus$.publish).toHaveBeenCalledTimes(1);
    expect(eventBus$.publish).toHaveBeenCalledWith(
      new UserPaypalWasChanged(userId.value, newPaypal.value),
    );

    expect(user.paypal.equals(newPaypal)).toBeTruthy();
  });
});
