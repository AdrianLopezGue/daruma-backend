import { ICommand } from '@nestjs/cqrs';

export class RemoveGroupCommand implements ICommand {
  constructor(public readonly groupId: string) {}
}
