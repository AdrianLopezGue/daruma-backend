import { Test, TestingModule } from '@nestjs/testing';

import { UserId } from '../../../user/domain/model/user-id';
import { CreateUserHandler } from './create-user.handler';
import { UserName } from '../../domain/model/user-name';
import { UserEmail } from '../../domain/model/user-email';
import { USERS, Users } from '../../domain/repository/users';
import { CreateUserCommand } from '../command';
import { User } from '../../domain/model/user';
import { CheckUniqueUserEmail } from '../../../../dist/user/domain/services/check-unique-user-email.service';
import { CHECK_UNIQUE_USER_EMAIL } from '../../domain/services/check-unique-user-email.service';

describe('CreateUserHandler', () => {
  let command$: CreateUserHandler;

  const users: Partial<Users> = {};
  const checkUniqueUserEmail: Partial<CheckUniqueUserEmail> = {};

  const userId = UserId.fromString('1111111');
  const username = UserName.fromString('john');
  const useremail = UserEmail.fromString('john@john.com');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: USERS,
          useValue: users,
        },
        {
          provide: CHECK_UNIQUE_USER_EMAIL,
          useValue: checkUniqueUserEmail,
        },
      ],
    }).compile();

    command$ = module.get<CreateUserHandler>(CreateUserHandler);
    users.find = jest.fn().mockResolvedValue(null);
    users.save = jest.fn();
    checkUniqueUserEmail.with = jest.fn().mockResolvedValue(null);
  });

  it('should creates a new user', async () => {
    await command$.execute(
      new CreateUserCommand(userId.value, username.value, useremail.value),
    );

    expect(users.save).toHaveBeenCalledWith(
      User.add(userId, username, useremail),
    );
  });
});
