import { ICommand } from '@nestjs/cqrs';
import { Payer } from '../../../payer/domain/model/payer';
import { Debtor } from '../../../debtor/domain/model/debtor';

export class CreateReceiptCommand implements ICommand {
  constructor(
    public readonly receiptId: string,
    public readonly expenseId: string,
    public readonly date: Date,
    public readonly payers: Payer[],
    public readonly debtors: Debtor[],
    public readonly money: bigint,
    public readonly currencyCode: string,
  ) {}
}