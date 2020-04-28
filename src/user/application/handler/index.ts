import { CreateUserHandler } from './create-user.handler';
import { ChangeUserNameHandler } from './change-user-name.handler';
import { ChangeUserPaypalHandler } from './change-user-paypal.handler';

export const CommandHandlers = [CreateUserHandler, ChangeUserNameHandler, ChangeUserPaypalHandler];
