import { ICommand } from '@nestjs/cqrs';

export class RemoveDebtTransactionCommand implements ICommand {
  constructor(public readonly billId: string, public readonly memberId: string) {}
}