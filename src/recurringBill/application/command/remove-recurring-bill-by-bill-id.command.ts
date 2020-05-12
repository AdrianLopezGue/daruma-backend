import { ICommand } from '@nestjs/cqrs';

export class RemoveRecurringBillByBillIdCommand implements ICommand {
  constructor(public readonly billId: string) {}
}