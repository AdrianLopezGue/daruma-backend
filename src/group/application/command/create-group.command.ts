import { ICommand } from '@nestjs/cqrs';

export class CreateGroupCommand implements ICommand {
  constructor(
    public readonly groupId: string,
    public readonly name: string,
    public readonly currencyCode: string,
    public readonly ownerId: string,
  ) {}
}
