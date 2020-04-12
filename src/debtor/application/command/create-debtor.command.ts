import { ICommand } from '@nestjs/cqrs';

export class CreateDebtorCommand implements ICommand {
  constructor(
    public readonly debtorId: string,
    public readonly expenseId: string,
    public readonly memberId: string,
    public readonly money: bigint,
    public readonly currencyCode: string,
  ) {}
}
