import { ICommand } from '@nestjs/cqrs';

export class RemoveDepositTransactionCommand implements ICommand {
  constructor(
    public readonly billId: string,
    public readonly memberId: string,
  ) {}
}
