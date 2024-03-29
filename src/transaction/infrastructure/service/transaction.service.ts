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
import { CreateDebtTransactionCommand } from '../../application/command/create-debt-transaction.command';
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
    groupId: string,
  ) {
    return this.commandBus.execute(
      new CreateTransferTransactionCommand(
        transactionId,
        senderId,
        beneficiaryId,
        money,
        currencyCode,
        groupId,
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
    senderId: string,
  ): Promise<TransferTransactionView[]> {
    return this.transferTransactionModel
      .find({ idSender: '' + senderId + '' })
      .exec();
  }

  async getTransferTransactionsByBeneficiary(
    beneficiaryId: string,
  ): Promise<TransferTransactionView[]> {
    return this.transferTransactionModel
      .find({ idBeneficiary: '' + beneficiaryId + '' })
      .exec();
  }

  async getDebtTransactionIdsByBillId(billId: string): Promise<string[]> {
    return this.debtTransactionModel.distinct('_id', { idBill: billId }).exec();
  }

  async getDepositTransactionIdsByBillId(billId: string): Promise<string[]> {
    return this.depositTransactionModel
      .distinct('_id', { idBill: billId })
      .exec();
  }

  async getTransferTransactionIdsByGroupId(groupId: string): Promise<string[]> {
    return this.transferTransactionModel
      .distinct('_id', { idGroup: groupId })
      .exec();
  }

  async getDebtTransactionByBillIdAndMemberId(
    billId: string,
    memberId: string,
  ): Promise<DebtTransactionView> {
    return this.debtTransactionModel
      .findOne({ idBill: billId, idMember: memberId }, { _id: 1 })
      .exec();
  }

  async getDepositTransactionByBillIdAndMemberId(
    billId: string,
    memberId: string,
  ): Promise<DepositTransactionView> {
    return this.depositTransactionModel
      .findOne({ idBill: billId, idMember: memberId }, { _id: 1 })
      .exec();
  }
}
