import { ICommand } from '@nestjs/cqrs';

export class ChangeMembersNameCommand implements ICommand {
  constructor(public readonly userId: string, public readonly name: string) {}
}
