import { ICommand } from '@nestjs/cqrs';

export class CreateReceiptCommand implements ICommand {
  constructor(
    public readonly receiptId: string,
    public readonly expenseId: string,
    public readonly date: Date,
    public readonly payers: string[],
    public readonly debtors: string[],
    public readonly money: bigint,
    public readonly currencyCode: string,
  ) {}
}