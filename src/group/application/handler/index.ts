import { CreateGroupHandler } from './create-group.handler';
import { ChangeGroupNameHandler } from './change-group-name.handler';
import { RemoveGroupHandler } from './remove-group.handler';
import { ChangeGroupCurrencyCodeHandler } from './change-group-currency-code.handler';

export const CommandHandlers = [
  CreateGroupHandler,
  ChangeGroupNameHandler,
  ChangeGroupCurrencyCodeHandler,
  RemoveGroupHandler,
];
