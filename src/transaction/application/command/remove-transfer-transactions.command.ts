import { ICommand } from '@nestjs/cqrs';

export class RemoveTransferTransactionsCommand implements ICommand {
  constructor(public readonly groupId: string) {}
}
