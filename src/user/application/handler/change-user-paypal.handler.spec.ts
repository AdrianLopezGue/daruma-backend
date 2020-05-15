import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import { UserName, UserEmail, User, UserId } from '../../domain/model';
import { USERS, Users } from '../../domain/repository';

import { UserIdNotFoundError } from '../../domain/exception/user-id-not-found.error';
import { ChangeUserPaypalHandler } from './change-user-paypal.handler';
import { UserPaypal } from '../../domain/model/user-paypal';
import { ChangeUserPaypalCommand } from '../command/change-user-paypal.command';

describe('Change User Paypal', () => {
  let command$: ChangeUserPaypalHandler;

  const users: Partial<Users> = {};

  const userId = UserId.fromString(uuid());
  const username = UserName.fromString('john');
  const useremail = UserEmail.fromString('john@john.com');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangeUserPaypalHandler,
        {
          provide: USERS,
          useValue: users,
        },
      ],
    }).compile();

    command$ = module.get<ChangeUserPaypalHandler>(ChangeUserPaypalHandler);
    users.find = jest.fn().mockResolvedValue(null);
    users.save = jest.fn();
  });

  it('should update name paypal nickname', async () => {
    const user = User.add(userId, username, useremail);

    expect(user.paypal.value).toBe('');

    const newNickname = UserPaypal.fromString('New name');

    users.find = jest.fn().mockResolvedValue(user);
    user.changePaypal(newNickname);

    await command$.execute(
      new ChangeUserPaypalCommand(userId.value, newNickname.value),
    );

    expect(users.save).toHaveBeenCalledTimes(1);
    expect(users.save).toHaveBeenCalledWith(user);
  });

  it('should throw an error if group does not exists', async () => {
    expect(
      command$.execute(new ChangeUserPaypalCommand(userId.value, 'New name')),
    ).rejects.toThrow(UserIdNotFoundError);

    expect(users.save).toHaveBeenCalledTimes(0);
  });
});
