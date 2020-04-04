import { Test, TestingModule } from '@nestjs/testing';

import { UserId } from '../../../user/domain/model/user-id';
import { CreateUserHandler } from './create-user.handler.command';
import { UserName } from '../../domain/model/user-name';
import { UserEmail } from '../../domain/model/user-email';
import { USERS, Users } from '../../domain/repository/users';
import { CreateUserCommand } from '../command';
import { User } from '../../domain/model/user';


describe('CreateUserHandler', () => {
  let command$: CreateUserHandler;

  const users: Partial<Users> = {};

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
        }
      ],
    }).compile();

    command$ = module.get<CreateUserHandler>(CreateUserHandler);
    users.save = jest.fn();
  });

  it('should creates a new member', async () => {
    await command$.execute(
      new CreateUserCommand(
        userId.value,
        username.value,
        useremail.value
      ),
    );

    expect(users.save).toHaveBeenCalledWith(
      User.add(userId, username, useremail),
    );
  });
});
