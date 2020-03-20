import { ICommand } from '@nestjs/cqrs';

export class ChangeGroupNameCommand implements ICommand {
  constructor(public readonly groupId: string, public readonly name: string) {}
}
