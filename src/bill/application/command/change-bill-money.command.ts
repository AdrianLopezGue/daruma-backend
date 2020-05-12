import { ICommand } from '@nestjs/cqrs';

export class ChangeBillMoneyCommand implements ICommand {
  constructor(public readonly billId: string, public readonly money: number) {}
}
