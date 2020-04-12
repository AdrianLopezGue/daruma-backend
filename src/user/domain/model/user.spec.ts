import { CqrsModule, EventBus, EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

import { UserWasCreated } from '../event';
import { User } from './user';
import { UserName } from './user-name';
import { UserEmail } from './user-email';
import { UserId } from './user-id';

describe('User', () => {
  let user: User;
  let eventBus$: EventBus;
  let eventPublisher$: EventPublisher;

  const userId = UserId.fromString(v4());
  const name = UserName.fromString('User Name');
  const email = UserEmail.fromString('User Email');

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
      new UserWasCreated(userId.value, name.value, email.value),
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
});
