import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';

import { UserName, UserEmail, User, UserId } from '../../domain/model';
import { USERS, Users } from '../../domain/repository';

import { ChangeUserNameCommand } from '../command/change-user-name.command';
import { ChangeUserNameHandler } from './change-user-name.handler';
import { UserIdNotFoundError } from '../../domain/exception/user-id-not-found.error';

describe('Change User Name Handler', () => {
  let command$: ChangeUserNameHandler;

  const users: Partial<Users> = {};

  const userId = UserId.fromString(uuid());
  const username = UserName.fromString('john');
  const useremail = UserEmail.fromString('john@john.com');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangeUserNameHandler,
        {
          provide: USERS,
          useValue: users,
        },
      ],
    }).compile();

    command$ = module.get<ChangeUserNameHandler>(ChangeUserNameHandler);
    users.find = jest.fn().mockResolvedValue(null);
    users.save = jest.fn();
  });

  it('should update name user', async () => {
    const user = User.add(userId, username, useremail);
    const newName = UserName.fromString('New name');

    users.find = jest.fn().mockResolvedValue(user);
    user.rename(newName);

    await command$.execute(
      new ChangeUserNameCommand(userId.value, newName.value),
    );

    expect(users.save).toHaveBeenCalledTimes(1);
    expect(users.save).toHaveBeenCalledWith(user);
  });

  it('should throw an error if group does not exists', async () => {
    expect(
      command$.execute(new ChangeUserNameCommand(userId.value, 'New name')),
    ).rejects.toThrow(UserIdNotFoundError);

    expect(users.save).toHaveBeenCalledTimes(0);
  });
});
