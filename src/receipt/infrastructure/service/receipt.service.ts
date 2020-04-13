import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { Model } from 'mongoose';

import { ReceiptView, RECEIPT_MODEL } from '../read-model/schema/receipt.schema';
import { CreateReceiptCommand } from '../../application/command/create-receipt.command';

@Injectable()
export class ReceiptService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(RECEIPT_MODEL) private readonly receiptModel: Model<ReceiptView>,
  ) {}

  async createReceipt(
    receiptId: string,
    expenseId: string,
    date: Date,
    payers: string[],
    debtors: string[],
    money: bigint,
    currencyCode: string,
  ) {
    return this.commandBus.execute(
      new CreateReceiptCommand(
        receiptId,
        expenseId,
        date,
        payers,
        debtors,
        money,
        currencyCode,
      ),
    );
  }

  async getReceipts(groupId: string): Promise<ReceiptView[]> {
    return this.receiptModel.find({ groupId: groupId }).exec();
  }
}
