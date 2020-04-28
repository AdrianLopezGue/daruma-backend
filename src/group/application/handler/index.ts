import { CreateGroupHandler } from './create-group.handler';
import { ChangeGroupNameHandler } from './change-group-name.handler';
import { RemoveGroupHandler } from './remove-group.handler';

export const CommandHandlers = [CreateGroupHandler, ChangeGroupNameHandler, RemoveGroupHandler];
