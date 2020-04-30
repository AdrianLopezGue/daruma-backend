import { ICommand } from '@nestjs/cqrs';

export class RemoveBillCommand implements ICommand {
  constructor(public readonly billId: string) {}
}