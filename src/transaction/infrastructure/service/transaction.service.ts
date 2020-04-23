import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { Model } from 'mongoose';
import { DEBT_TRANSACTION_MODEL, DebtTransactionView } from '../read-model/schema/debt-transaction.schema';
import { DEPOSIT_TRANSACTION_MODEL, DepositTransactionView } from '../read-model/schema/deposit-transaction.schema';
import { CreateDebtTransactionCommand } from '@app/transaction/application/command/create-debt-transaction.command';
import { CreateDepositTransactionCommand } from '../../application/command/create-deposit-transaction.command';
@Injectable()
export class TransactionService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(DEBT_TRANSACTION_MODEL) private readonly debtTransactionModel: Model<DebtTransactionView>,
    @Inject(DEPOSIT_TRANSACTION_MODEL) private readonly depositTransactionModel: Model<DepositTransactionView>,
  ) {}

  async createDebtTransaction(
    transactionId: string,
    memberId: string,
    billId: string,
    money: number,
    currencyCode: string,
  ) {
    return this.commandBus.execute(
      new CreateDebtTransactionCommand(
        transactionId,
        memberId,
        billId,
        money,
        currencyCode,
      ),
    );
  }

  async createDepositTransaction(
    transactionId: string,
    memberId: string,
    billId: string,
    money: number,
    currencyCode: string,
  ) {
    return this.commandBus.execute(
      new CreateDepositTransactionCommand(
        transactionId,
        memberId,
        billId,
        money,
        currencyCode,
      ),
    );
  }

  async getDebtTransactions(memberId: string): Promise<DebtTransactionView[]> {
    return this.debtTransactionModel.find({ 'memberId': "" + memberId + "" }).exec();
  }

  async getDepositTransactions(memberId: string): Promise<DepositTransactionView[]> {
    return this.depositTransactionModel.find({ 'memberId': "" + memberId + "" }).exec();
  }
}