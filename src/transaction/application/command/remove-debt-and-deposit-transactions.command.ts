import { ICommand } from '@nestjs/cqrs';

export class RemoveDebtAndDepositTransactionsCommand implements ICommand {
  constructor(public readonly billId: string) {}
}