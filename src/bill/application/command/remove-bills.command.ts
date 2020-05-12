import { ICommand } from '@nestjs/cqrs';

export class RemoveBillsCommand implements ICommand {
  constructor(public readonly groupId: string) {}
}
