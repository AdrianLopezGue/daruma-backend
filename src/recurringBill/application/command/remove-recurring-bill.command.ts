import { ICommand } from '@nestjs/cqrs';

export class RemoveRecurringBillCommand implements ICommand {
  constructor(public readonly recurringBillId: string) {}
}