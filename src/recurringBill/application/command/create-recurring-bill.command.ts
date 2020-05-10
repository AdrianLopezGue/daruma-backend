import { ICommand } from '@nestjs/cqrs';

export class CreateRecurringBillCommand implements ICommand {
  constructor(
    public readonly recurringBillId: string,
    public readonly billId: string,
    public readonly groupId: string,
    public readonly date: Date,
    public readonly period: number,
  ) {}
}
