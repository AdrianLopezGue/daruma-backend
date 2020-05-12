import { ICommand } from '@nestjs/cqrs';

export class ChangeBillDateCommand implements ICommand {
  constructor(public readonly billId: string, public readonly date: Date) {}
}
