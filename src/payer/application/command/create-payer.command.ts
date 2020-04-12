
import { ICommand } from '@nestjs/cqrs';

export class CreatePayerCommand implements ICommand {
  constructor(
    public readonly payerId: string,
    public readonly expenseId: string,
    public readonly memberId: string,
    public readonly money: bigint,
    public readonly currencyCode: string,
  ) {}
}