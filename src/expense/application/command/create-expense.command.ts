import { ICommand } from '@nestjs/cqrs';

export class CreateExpenseCommand implements ICommand {
  constructor(
    public readonly expenseId: string,
    public readonly name: string,
    public readonly money: bigint,
    public readonly currencyCode: string,
    public readonly payers: string[],
    public readonly debtors: string[],
    public readonly date: Date,
    public readonly periodicity: string,
    public readonly endPeriodicity: Date,
  ) {}
}
