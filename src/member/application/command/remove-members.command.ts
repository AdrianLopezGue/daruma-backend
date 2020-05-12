import { ICommand } from '@nestjs/cqrs';

export class RemoveMembersCommand implements ICommand {
  constructor(public readonly groupId: string) {}
}
