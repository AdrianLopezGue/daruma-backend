import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactions } from '../../domain/repository/transactions';
import { TRANSACTIONS } from '../../domain/repository/index';
import { TransactionId } from '../../domain/model/transaction-id';
import { MemberId } from '../../../member/domain/model/member-id';
import { BillCurrencyUnit } from '../../../bill/domain/model/bill-currency-unit';
import { GroupCurrencyCode } from '../../../group/domain/model/group-currency-code';
import { BillAmount } from '../../../bill/domain/model/bill-amount';
import { CreateTransferTransactionCommand } from '../command/create-transfer-transaction.command';
import { TransferTransaction } from '../../domain/model/transfer-transaction';
import { GroupId } from '../../../group/domain/model/group-id';
import { GROUPS, Groups } from '../../../group/domain/repository/index';
import { GroupIdNotFoundError } from '../../../group/domain/exception/group-id-not-found.error';
import { MemberIdNotFoundError } from '../../../member/domain/exception/member-id-not-found.error';
import { GET_MEMBERS_BY_GROUP_ID, GetMembersIdByGroupId } from '../../../member/domain/services/get-members-by-group-id.service';

@CommandHandler(CreateTransferTransactionCommand)
export class CreateTransferTransactionHandler
  implements ICommandHandler<CreateTransferTransactionCommand> {
  constructor(
    @Inject(TRANSACTIONS) private readonly transactions: Transactions,
    @Inject(GROUPS) private readonly groups: Groups,
    @Inject(GET_MEMBERS_BY_GROUP_ID)
    private readonly getMembersByGroupId: GetMembersIdByGroupId,
  ) {}

  async execute(command: CreateTransferTransactionCommand) {
    const transactionId = TransactionId.fromString(command.transactionId);
    const senderId = MemberId.fromString(command.senderId);
    const beneficiaryId = MemberId.fromString(command.beneficiaryId);
    const amount = BillAmount.withMoneyAndCurrencyCode(
      BillCurrencyUnit.fromNumber(command.money),
      GroupCurrencyCode.fromString(command.currencyCode),
    );
    const groupId = GroupId.fromString(command.groupId);

    if ((await this.groups.find(groupId)) === null) {
      throw GroupIdNotFoundError.withString(command.groupId);
    }

    if (
      (await this.getMembersByGroupId.with(GroupId.fromString(groupId.value))).find(value => value === senderId.value) === undefined ||
      (await this.getMembersByGroupId.with(GroupId.fromString(groupId.value))).find(value => value === beneficiaryId.value) === undefined
    ) {
      throw MemberIdNotFoundError.withString('');
    }

    const transaction = TransferTransaction.add(
      transactionId,
      senderId,
      beneficiaryId,
      amount,
      groupId,
    );

    this.transactions.saveTransferTransaction(transaction);
  }
}
