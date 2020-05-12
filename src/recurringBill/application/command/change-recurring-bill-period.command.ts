import { ICommand } from '@nestjs/cqrs';

export class ChangeRecurringBillPeriodCommand implements ICommand {
  constructor(public readonly recurringBillId: string, public readonly period: number) {}
}