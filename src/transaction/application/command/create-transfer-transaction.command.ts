import { ICommand } from '@nestjs/cqrs';

export class CreateTransferTransactionCommand implements ICommand {
  constructor(
    public readonly transactionId: string,
    public readonly senderId: string,
    public readonly beneficiaryId: string,
    public readonly money: number,
    public readonly currencyCode: string,
  ) {}
}
