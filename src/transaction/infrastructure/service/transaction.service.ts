import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { Model } from 'mongoose';
import {
  DEBT_TRANSACTION_MODEL,
  DebtTransactionView,
} from '../read-model/schema/debt-transaction.schema';
import {
  DEPOSIT_TRANSACTION_MODEL,
  DepositTransactionView,
} from '../read-model/schema/deposit-transaction.schema';
import { CreateDebtTransactionCommand } from '@app/transaction/application/command/create-debt-transaction.command';
import { CreateDepositTransactionCommand } from '../../application/command/create-deposit-transaction.command';
import { CreateTransferTransactionCommand } from '../../application/command/create-transfer-transaction.command';
import {
  TRANSFER_TRANSACTION_MODEL,
  TransferTransactionView,
} from '../read-model/schema/transfer-transaction.schema';
@Injectable()
export class TransactionService {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(DEBT_TRANSACTION_MODEL)
    private readonly debtTransactionModel: Model<DebtTransactionView>,
    @Inject(DEPOSIT_TRANSACTION_MODEL)
    private readonly depositTransactionModel: Model<DepositTransactionView>,
    @Inject(TRANSFER_TRANSACTION_MODEL)
    private readonly transferTransactionModel: Model<TransferTransactionView>,
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

  async createTransferTransaction(
    transactionId: string,
    senderId: string,
    beneficiaryId: string,
    money: number,
    currencyCode: string,
  ) {
    return this.commandBus.execute(
      new CreateTransferTransactionCommand(
        transactionId,
        senderId,
        beneficiaryId,
        money,
        currencyCode,
      ),
    );
  }

  async getDebtTransactions(memberId: string): Promise<DebtTransactionView[]> {
    return this.debtTransactionModel
      .find({ memberId: '' + memberId + '' })
      .exec();
  }

  async getDepositTransactions(
    memberId: string,
  ): Promise<DepositTransactionView[]> {
    return this.depositTransactionModel
      .find({ memberId: '' + memberId + '' })
      .exec();
  }

  async getTransferTransactionsBySender(
    idSender: string,
  ): Promise<TransferTransactionView[]> {
    return this.transferTransactionModel
      .find({ idSender: '' + idSender + '' })
      .exec();
  }

  async getTransferTransactionsByBeneficiary(
    idBeneficiary: string,
  ): Promise<TransferTransactionView[]> {
    return this.transferTransactionModel
      .find({ idBeneficiary: '' + idBeneficiary + '' })
      .exec();
  }
}
