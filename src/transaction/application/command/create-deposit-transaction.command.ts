import { ICommand } from '@nestjs/cqrs';

export class CreateDepositTransactionCommand implements ICommand {
  constructor(
    public readonly transactionId: string,
    public readonly memberId: string,
    public readonly billId: string,
    public readonly money: number,
    public readonly currencyCode: string,
  ) {}
}